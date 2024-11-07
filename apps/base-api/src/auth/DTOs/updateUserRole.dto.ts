import { RoleName } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRolesDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(RoleName)
  newRole: RoleName;
}
