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
    async obtenerPersonales(
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ): Promise<PersonalData[]> {
        return this.personalService.obtenerPersonales({ cargo, dni, edad });
    }

    @Query(() => Int)
    async obtenerConteoPersonales(
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ) {
        return this.personalService.obtenerConteoPersonales({ cargo, dni, edad });
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
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorHora({cargo, dni, edad });
    }

    @Query(() => Float)
    async obtenerMontoTotalPorDia(
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorDia({cargo, dni, edad });
    }

    @Query(() => Float)
    async obtenerMontoTotalPorSemana(
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorSemana({cargo, dni, edad});
    }

    @Query(() => Float)
    async obtenerMontoTotalPorMes(
        @Args('cargo', { nullable: true }) cargo?: string,
        @Args('dni', { nullable: true }) dni?: string,
        @Args('edad', { nullable: true }) edad?: number,
    ): Promise<number> {
        return this.personalService.obtenerMontoTotalPorMes({cargo, dni, edad});
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
        @Args('data') data: CrearPersonalInput,
    ): Promise<boolean> {
        await this.personalService.crearPersonal(data);
        return true;
    }

    @Mutation(() => Personal)
    async actualizarPersonal(
        @Args('dniPersonal') dniPersonal: string,
        @Args('data') data: ActualizarPersonalInput,
    ) {
        return this.personalService.actualizarPersonal(dniPersonal,data);
    }

    @Mutation(() => Boolean)
    async borrarPersonal(
        @Args('dniPersonal') dniPersonal: string,
    ) {
        await this.personalService.borrarPersonal(dniPersonal);
        return true;
    }
}