import { RoleName } from '@prisma/client';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class UpdateRolePermissionsDTO {
  @IsEnum(RoleName)
  role: RoleName;

  @IsArray()
  @IsString({ each: true })
  permissionsToAdd: string[];

  @IsArray()
  @IsString({ each: true })
  permissionsToRemove: string[];
}
