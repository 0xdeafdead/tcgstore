import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./createUser.dto";

export class UpdateUserDTO extends OmitType(CreateUserDTO,["role","email"] as const){}