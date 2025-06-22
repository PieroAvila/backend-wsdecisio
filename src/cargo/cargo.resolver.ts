import { Int, Query, Resolver } from "@nestjs/graphql";
import { Cargo } from "./cargo.model";
import { CargoService } from "./cargo.service";

@Resolver(() => Cargo)
export class CargoResolver {
    constructor(private readonly cargoService: CargoService) {}

    @Query(() => [Cargo])
    async obtenerCargos() {
        return this.cargoService.obtenerCargos();
    }

    @Query(() => Int)
    async obtenerConteoCargos() {
        return this.cargoService.obtenerConteoCargos();
    }
}