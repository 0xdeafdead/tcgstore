import { RoleName } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRolePermissionsDTO {
  @IsEnum(RoleName)
  role: RoleName;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionsToAdd: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionsToRemove: string[];
}
