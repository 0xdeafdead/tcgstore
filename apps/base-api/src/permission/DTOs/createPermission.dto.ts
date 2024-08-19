import { IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionDTO {
  @IsString()
  @MaxLength(20)
  @Matches(/\w/)
  name: string;
}
