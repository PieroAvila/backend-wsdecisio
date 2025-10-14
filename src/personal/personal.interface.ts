export interface PersonalData {
    dniPersonal: string;
    nombre: string;
    apellido: string;
    personal: string;
    edad: number;
    correo: string;
    telefono: string;
    cuentaBcp: string;
    idCargo: number | null,
    cargo: string | null;
    pagoHora: number | null;
  }