import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActividadData } from "./actividad.interface";
import { CrearActividadInput } from "./crear-actividad.input";
import { ActualizarActividadInput } from "./actualizar-actividad.input";

@Injectable()
export class ActividadService {
    constructor(private readonly prisma: PrismaService) {}
    
    async obtenerActividad(
        filtro?: {
            proyecto?: string;
            personal?: string;
            estado?: string;
        }
    ): Promise<ActividadData[]> {
        let where: any = {};

        if (filtro?.proyecto) {
            where.codProyecto = filtro.proyecto;
        }

        if (filtro?.personal) {
            where.dniPersonal = filtro.personal;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        const actividades = await this.prisma.actividad.findMany({
            include: {
                proyecto: true,
                personal: true,
            }
        });
        return actividades.map((a) => ({
            idActividad: a.idActividad,
            codProyecto: a.codProyecto,
            dniPersonal: a.dniPersonal,
            encargado: a.personal?.nombre +" "+a.personal?.apellido,
            tipoActividad: a.tipoActividad,
            estado: a.estado,
            duracionEstimada: a.duracionEstimada,
            duracionReal: a.duracionReal ?? 0,
        }));
    }

    async obtenerConteoActividades(
        filtro?: {
            proyecto?: string;
            personal?: string;
            estado?: string;
        }
    ): Promise<number> {
        let where: any = {};

        if (filtro?.proyecto) {
            where.codProyecto = filtro.proyecto;
        }

        if (filtro?.personal) {
            where.dniPersonal = filtro.personal;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        const resultado = await this.prisma.actividad.aggregate({
            _count: {
                idActividad: true,
            },
            where,
        })
        return Number(resultado._count.idActividad) || 0;
    }

    async obtenerConteoActividadesCompletadas(
        filtro?: {
            personal?: string;
        }
    ) {
        let where: any = {};

        if (filtro?.personal) {
            where.dniPersonal = filtro.personal;
        }
        return this.prisma.actividad.count({
            where: {
                duracionReal: {
                    not: null,
                }
            }
        });
    }

    async obtenerEstados(): Promise<string[]> {
      const actividades = await this.prisma.actividad.findMany({
          select: { estado: true },
          distinct: ['estado'],
      });
      return actividades.map((p) => p.estado);
  }

  async crearActividad(input: CrearActividadInput): Promise<void> {
    const {
      codProyecto,
      dniPersonal,
      tipoActividad,
      estado,
      duracionEstimada,
      duracionReal,
    } = input;
  
    const proyectoExistente = await this.prisma.proyecto.findFirst({
      where: { codProyecto },
    });
    if (!proyectoExistente) {
      throw new HttpException(
        'El proyecto no existe en la base de datos',
        HttpStatus.CONFLICT,
      );
    }
  
    const personalExistente = await this.prisma.personal.findFirst({
      where: { dniPersonal },
      include: { cargo: true },
    });
  
    if (!personalExistente) {
      throw new HttpException(
        'El personal no existe en la base de datos',
        HttpStatus.CONFLICT,
      );
    }
    if (!personalExistente.idCargo || !personalExistente.cargo) {
      throw new HttpException(
        'El personal no tiene un cargo asignado',
        HttpStatus.CONFLICT,
      );
    }
  
    try {
      // Buscar el último idActividad
      const ultimaActividad = await this.prisma.actividad.findFirst({
        orderBy: { idActividad: 'desc' },
        select: { idActividad: true },
      });
  
      const nuevoId = (ultimaActividad?.idActividad || 0) + 1;
  
      await this.prisma.actividad.create({
        data: {
          idActividad: nuevoId,
          codProyecto,
          dniPersonal,
          tipoActividad,
          estado,
          duracionEstimada,
          duracionReal: duracionReal ?? null,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error al crear la actividad: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
      

    async actualizarActividad(
        idActividad: number,
        input: ActualizarActividadInput,
      ): Promise<ActividadData[]> {
        const { dniPersonal, estado, duracionReal } = input;

        const actividadExistente = await this.prisma.actividad.findUnique({
          where: { idActividad },
          include: {
            proyecto: true,
            personal: {
              include: {
                cargo: true,
              },
            },
          },
        });
      
        if (!actividadExistente) {
          throw new HttpException('La actividad no existe', HttpStatus.NOT_FOUND);
        }
      
        // 2️⃣ Si cambia el personal → validar que exista y tenga cargo
        if (dniPersonal) {
          const personalExistente = await this.prisma.personal.findUnique({
            where: { dniPersonal },
            include: { cargo: true },
          });
      
          if (!personalExistente) {
            throw new HttpException(
              `El personal con DNI ${dniPersonal} no existe`,
              HttpStatus.BAD_REQUEST,
            );
          }
      
          if (!personalExistente.idCargo) {
            throw new HttpException(
              `El personal con DNI ${dniPersonal} no tiene un cargo asignado`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      
        const nuevoDniPersonal = dniPersonal ?? actividadExistente.dniPersonal;
        const nuevoEstado = estado ?? actividadExistente.estado;
        const nuevaDuracionReal = duracionReal ?? actividadExistente.duracionReal;
      
        const updateActividad = await this.prisma.actividad.update({
          where: { idActividad },
          data: {
            dniPersonal: nuevoDniPersonal,
            estado: nuevoEstado,
            duracionReal: nuevaDuracionReal,
          },
          include: {
            proyecto: true,
            personal: {
              include: {
                cargo: true,
              },
            },
          },
        });
        const resultado: ActividadData = {
          codProyecto: updateActividad.codProyecto,
          dniPersonal: updateActividad.dniPersonal,
          encargado: `${updateActividad.personal?.nombre ?? ''} ${updateActividad.personal?.apellido ?? ''}`,
          tipoActividad: updateActividad.tipoActividad,
          estado: updateActividad.estado,
          duracionEstimada: updateActividad.duracionEstimada,
          duracionReal: updateActividad.duracionReal || 0,
        };
      
        return [resultado];
    }
    
    async borrarActividad(idActividad: number): Promise<void> {
        const actividades = await this.prisma.actividad.findUnique({
            where: { idActividad },
        });

        if (!actividades) {
            throw new HttpException(
                `El detalle con ID ${idActividad} no se encuentra`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.actividad.delete({
            where: { idActividad }
        });
    }
}

