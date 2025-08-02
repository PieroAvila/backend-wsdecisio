import { Decimal } from "@prisma/client/runtime/library";

export interface ProyectoData {
    codProyecto: string;
    nombreProyecto: string;
    dniCliente: string;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    costoProyecto: Decimal | null;
}