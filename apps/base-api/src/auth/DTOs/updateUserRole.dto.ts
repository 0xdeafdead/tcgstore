import { RoleName } from '@prisma/client';
import { IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRolesDTO {
  @IsEmail()
  email: string;

  @IsArray()
  @IsEnum(RoleName, { each: true })
  rolesToAdd: RoleName[];

  @IsArray()
  @IsEnum(RoleName, { each: true })
  rolesToRemove: RoleName[];
}
