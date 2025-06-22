import { Args, Float, Int, Query, Resolver } from "@nestjs/graphql";
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

    @Query(() => String, { nullable: true })
    async obtenerCargoMejorPagado() {
        return this.cargoService.obtenerCargoMejorPagado();
    }

    @Query(() => Float)
    async obtenerMontoTotalHora(@Args('cargo', { nullable: true }) cargo?: string) {
        return this.cargoService.obtenerMontoTotalHora(cargo);
    }

    @Query(() => Cargo, { nullable: true })
    async obtenerCargoPorNombre(@Args('cargo') cargo: string) {
        return this.cargoService.obtenerCargoPorNombre(cargo);
    }
}