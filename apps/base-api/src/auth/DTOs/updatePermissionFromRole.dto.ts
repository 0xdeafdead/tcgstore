import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRolePermissionsDTO {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionsToAdd: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionsToRemove: string[];
}
