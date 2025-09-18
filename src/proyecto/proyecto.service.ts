import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProyectoData } from "./proyecto.interface";
import { CrearProyectoInput } from "./crear-proyecto.input";
import { ActualizarProyectoInput } from "./actualizar-proyecto.input";

@Injectable()
export class ProyectoService {
    constructor(private readonly prisma: PrismaService) {}
    
    async obtenerProyectos(filtro?: {
        desde?: string;
        hasta?: string;
        cliente?: string;
        estado?: string;
    }): Promise<ProyectoData[]> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.fechaInicio = {
                gte: desde,
                lte: hasta,
            };
        }

        if (filtro?.cliente) {
            where.dniCliente = filtro.cliente;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        const proyectos = await this.prisma.proyecto.findMany({
            include: {
                cliente: true,
            },
            where,
        });

        return proyectos.map((p) => ({
            codProyecto: p.codProyecto,
            nombreProyecto: p.nombreProyecto,
            dniCliente: p.dniCliente,
            nombre: p.cliente?.nombre || '',
            fechaInicio: p.fechaInicio.toISOString().split('T')[0],
            fechaFin: p.fechaFin.toISOString().split('T')[0],
            estado: p.estado,
            costoProyecto: p.costoProyecto,
        }));
    }

    async obtenerConteoProyectos(filtro?: {
        desde?: string;
        hasta?: string;
        cliente?: string;
        estado?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.fechaInicio = {
                gte: desde,
                lte: hasta,
            };
        }

        if (filtro?.cliente) {
            where.dniCliente = filtro.cliente;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        const resultado = await this.prisma.proyecto.aggregate({
            _count: {
                codProyecto: true,
            },
            where,
        })
        return Number(resultado._count.codProyecto) || 0;
    }

    async obtenerMontoTotal(
        filtro?: {
            desde?: string;
            hasta?: string;
            cliente?: string;
            estado?: string;
        }
    ): Promise<number> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.fechaInicio = {
                gte: desde,
                lte: hasta,
            };
        }

        if (filtro?.cliente) {
            where.dniCliente = filtro.cliente;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }


        const resultado = await this.prisma.proyecto.aggregate({
            _sum: {
                costoProyecto: true,
            },
            where,
        });
        return Number(resultado._sum.costoProyecto) || 0;
    }

    async obtenerClientesDisponibles(): Promise<string[]> {
        const clientes = await this.prisma.cliente.findMany({
            select: {
                dniCliente: true,
            },
            distinct: ['dniCliente']
        });

        return clientes.map((c) => c.dniCliente)
    }

    async obtenerPromedioProyectosPorCliente(): Promise<number> {
        const proyectosPorCliente = await this.prisma.proyecto.groupBy({
            by: ['dniCliente'],
            _count: {
                codProyecto: true,
            },
        });
        const totalClientes = proyectosPorCliente.length;
        const totalProyectos = proyectosPorCliente.reduce(
            (acc, item) => acc + item._count.codProyecto,
            0
        );
        const promedio = totalClientes === 0 ? 0: totalProyectos / totalClientes;
        return promedio;
    }

    async crearProyecto(
        input: CrearProyectoInput,
    ): Promise<void> {
        const {
            codProyecto,
            nombreProyecto,
            dniCliente,
            fechaInicio,
            fechaFin,
            estado,
            costoProyecto,
        } = input;

        const codigoExistente = await this.prisma.proyecto.findFirst({
            where: { codProyecto },
        });

        if (codigoExistente) {
            throw new HttpException(
                'El proyecto ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        try {
            await this.prisma.proyecto.create({
                data: {
                    codProyecto,
                    nombreProyecto,
                    dniCliente,
                    fechaInicio: new Date(fechaInicio),
                    fechaFin: new Date(fechaFin),
                    estado,
                    costoProyecto: costoProyecto ?? 0
                },
            })
        } catch (error) {
            throw new HttpException(
                `Error al registrar la compra ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarProyecto(
        codProyecto: string,
        input: ActualizarProyectoInput,
    ): Promise<ProyectoData[]> {
        const proyectoExistente = await this.prisma.proyecto.findUnique({
            where: { codProyecto },
            include: { cliente: true },
        });
    
        if (!proyectoExistente) {
            throw new HttpException(
                'El proyecto no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }
    
        const proyectoActualizado = await this.prisma.proyecto.update({
            where: { codProyecto },
            data: { ...input },
        });
    
        if (input.estado === 'FINALIZADO') {
            await this.prisma.maquinaria.updateMany({
                where: {
                    detaMaquinaria: {
                        some: {
                            detaProyecto: {
                                codProyecto: codProyecto,
                            },
                        },
                    },
                },
                data: { estado: 'DISPONIBLE' },
            });
        }
    
        const proyectos = await this.prisma.proyecto.findMany({
            include: { cliente: true },
        });
    
        const ProyectoDatos: ProyectoData[] = proyectos.map((p) => ({
            codProyecto: p.codProyecto,
            nombreProyecto: p.nombreProyecto,
            dniCliente: p.dniCliente,
            nombre: p.cliente?.nombre || '',
            fechaInicio: p.fechaInicio.toISOString().split('T')[0],
            fechaFin: p.fechaFin.toISOString().split('T')[0],
            estado: p.estado,
            costoProyecto: p.costoProyecto,
        }));
    
        return ProyectoDatos;
    }
    
    
    async borrarProyecto(codProyecto: string): Promise<boolean> {
        const proyectos = await this.prisma.proyecto.findMany({
            where: { codProyecto },
        });
        if (proyectos.length === 0) {
            throw new HttpException(
                `El proyecto con codigo ${codProyecto} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.proyecto.deleteMany({
            where: { codProyecto },
        });

        return true;
    }
}