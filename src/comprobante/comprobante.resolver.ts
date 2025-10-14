import { Query, Resolver } from "@nestjs/graphql";
import { Comprobante } from "./comprobante.model";
import { ComprobanteService } from "./comprobante.service";
import { ComprobanteData } from "./comprobante.interface";

@Resolver(() => Comprobante)
export class ComprobanteResolver {
    constructor(private readonly comprobanteService: ComprobanteService) {}

    @Query(() => [Comprobante])
    async obtenerComprobantes(): Promise<ComprobanteData[]> {
        return this.comprobanteService.obtenerComprobante();
    }

    @Query(() => [String])
    async obtenerComprobanteString() {
        return this.comprobanteService.obtenerComprobanteString();
    }
}