import { Decimal } from "@prisma/client/runtime/library";

export interface PersonalData {
    dniPersonal: string;
    edad: number;
    correo: string;
    telefono: string;
    cuentaBcp: string;
    idCargo: number | null;
    cargo: {
      idCargo: number;
      cargo: string;
      pagoHora: Decimal;
    } | null;
  }