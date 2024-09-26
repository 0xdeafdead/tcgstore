import { RoleName } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDTO {
  @IsEmail()
  email: string;

  @IsEnum(RoleName)
  roleName: RoleName;
}
