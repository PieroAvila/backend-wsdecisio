import { Args, Float, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Personal } from "./personal.model";
import { PersonalService } from "./personal.service";
import { PersonalData } from "./personal.interface";
import { CrearPersonalInput } from "./crear-personal.input";
import { ActualizarPersonalInput } from "./actualizar-personal.input";

@Resolver(() => Personal)
export class PersonalResolver {
    constructor(private readonly personalService: PersonalService) {}

    @Query(() => [Personal])
    async obtenerPersonales(): Promise<PersonalData[]> {
        return this.personalService.obtenerPersonales();
    }

    @Query(() => Int)
    async obtenerConteoPersonales() {
        return this.personalService.obtenerConteoPersonales();
    }

    @Query(() => Int)
    async obtenerConteoPersonalesConCargo() {
        return this.personalService.obtenerConteoPersonalesConCargo();
    }

    @Query(() => Int)
    async obtenerConteoPersonalesSinCargo() {
        return this.personalService.obtenerConteoPersonalesSinCargo();
    }

    @Query(() => Float)
    async obtenerMontoTotalPorHora(
        @Args('edad', { nullable: true, type: () => Int }) edad?: number,
        @Args('cargo', { nullable: true }) cargo?: string,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorHora({edad, cargo});
    }

    @Query(() => Float)
    async obtenerMontoTotalPorDia(
        @Args('edad', { nullable: true, type: () => Int }) edad?: number,
        @Args('cargo', { nullable: true }) cargo?: string,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorDia({edad, cargo});
    }

    @Query(() => Float)
    async obtenerMontoTotalPorSemana(
        @Args('edad', { nullable: true, type: () => Int }) edad?: number,
        @Args('cargo', { nullable: true }) cargo?: string,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorSemana({edad, cargo});
    }

    @Query(() => Float)
    async obtenerMontoTotalPorMes(
        @Args('edad', { nullable: true, type: () => Int }) edad?: number,
        @Args('cargo', { nullable: true }) cargo?: string,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorMes({edad, cargo});
    }

    @Query(() => [Personal])
    async obtenerPersonalesPorCargo(
        @Args('cargo') cargo: string,
    ): Promise<PersonalData[]> {
        return this.personalService.obtenerPersonalesPorCargo(cargo);
    }

    @Query(() => [Personal])
    async obtenerPersonalesPorEdad(
        @Args('edad', { type: () => Int }) edad: number,
    ): Promise<PersonalData[]> {
        return this.personalService.obtenerPersonalesPorEdad(edad);
    }

    @Query(() => [String])
    async obtenerCargosDisponibles() {
        return this.personalService.obtenerCargosDisponibles();
    }

    @Query(() => [Int])
    async obtenerEdadesDisponibles() {
        return this.personalService.obtenerEdadesDisponibles();
    }

    @Mutation(() => Boolean)
    async crearPersonal(
        @Args('input') input: CrearPersonalInput,
    ): Promise<boolean> {
        await this.personalService.crearPersonal(input, {} as any, {} as any);
        return true;
    }

    @Mutation(() => Personal)
    async actualizarPersonal(
        @Args('dniPersonal') dniPersonal: string,
        @Args('input') input: ActualizarPersonalInput,
    ) {
        return this.personalService.actualizarPersonal(dniPersonal,input);
    }

    @Mutation(() => Boolean)
    async borrarPersonal(
        @Args('dniPersonal') dniPersonal: string,
    ) {
        await this.personalService.borrarPersonal(dniPersonal);
        return true;
    }
}