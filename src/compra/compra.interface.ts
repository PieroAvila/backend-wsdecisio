import { Decimal } from "@prisma/client/runtime/library";

export interface CompraData {
    codCompra: string;
    rucProveedor: string;
    razonSocial: string;
    costoTotal: Decimal | null;
    fechaCompra: string;
}