import { RoleName } from '@prisma/client';
import { IsEnum, IsString, Matches, MaxLength } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @MaxLength(20)
  @Matches(/\w/)
  name: string;

  @IsEnum(RoleName)
  role = RoleName.USER;
}
