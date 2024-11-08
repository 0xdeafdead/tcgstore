import { RoleName } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRolesDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(RoleName)
  newRole: RoleName;
}
