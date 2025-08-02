import { Resolver } from "@nestjs/graphql";
import { DetaProyecto } from "./detaproyecto.model";
import { DetaProyectoService } from "./detaproyecto.service";

@Resolver(() => DetaProyecto)
export class DetaProyectoResolver {
    constructor(private readonly detaproyectoService: DetaProyectoService) {}

}