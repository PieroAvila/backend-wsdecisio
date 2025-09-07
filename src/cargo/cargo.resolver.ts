import { Args, Float, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cargo } from './cargo.model';
import { CargoService } from './cargo.service';
import { CrearCargoInput } from './crear-cargo.input';
import { ActualizarCargoInput } from './actualizar-cargo.input';

@Resolver(() => Cargo)
export class CargoResolver {
  constructor(private readonly cargoService: CargoService) {}

  @Query(() => [Cargo])
  async obtenerCargos(
    @Args('cargo', { nullable: true }) cargo?: string,
  ) {
    return this.cargoService.obtenerCargos({ cargo });
  }

  @Query(() => Int)
  async obtenerConteoCargos(
    @Args('cargo', { nullable: true }) cargo?: string,
  ) {
    return this.cargoService.obtenerConteoCargos({ cargo });
  }

  @Query(() => String, { nullable: true })
  async obtenerCargoMejorPagado() {
    return this.cargoService.obtenerCargoMejorPagado();
  }

  @Query(() => Float)
  async obtenerMontoTotalHora(
    @Args('cargo', { nullable: true }) cargo?: string,
  ) {
    return this.cargoService.obtenerMontoTotalHora(cargo);
  }

  @Mutation(() => Boolean)
  async crearCargo(@Args('data') data: CrearCargoInput) {
    await this.cargoService.crearCargo(data);
    return true;
  }

  @Mutation(() => Cargo)
  async actualizarCargo(
    @Args('idCargo', { type: () => Int }) idCargo: number,
    @Args('data') data: ActualizarCargoInput,
  ) {
    return this.cargoService.actualizarCargo(idCargo, data);
  }

  @Mutation(() => Boolean)
  async borrarCargo(@Args('cargo') cargo: string) {
    await this.cargoService.borrarCargo(cargo);
    return true;
  }
}
