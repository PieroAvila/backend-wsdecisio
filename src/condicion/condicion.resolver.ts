import { Query, Resolver } from "@nestjs/graphql";
import { Condicion } from "./condicion.model";
import { CondicionService } from "./condicion.service";
import { CondicionData } from "./condicion.interface";

@Resolver(() => Condicion)
export class CondicionResolver {
    constructor(private readonly condicionService: CondicionService) {}

    @Query(() => [Condicion])
    async obtenerCondiciones(): Promise<CondicionData[]> {
        return this.condicionService.obtenerCondicion();
    }
}