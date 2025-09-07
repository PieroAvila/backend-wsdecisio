export interface DetaMaterialData {
    codProyecto: string;
    codMaterial: string;
    descripcion: string;
    cantidad: number;
    cantidadUsada: number | null;
    cantidadRestante: number | null;
    cantidadDisponible: number;
}