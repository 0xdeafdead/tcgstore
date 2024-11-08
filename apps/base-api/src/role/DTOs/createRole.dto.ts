import { RoleName } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @MaxLength(20)
  @Matches(/\w/)
  name: string;

  @IsEnum(RoleName)
  role: RoleName = RoleName.USER;

  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
