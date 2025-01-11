import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRolesDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
