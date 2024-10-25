import { IsEmail } from 'class-validator';

export class signInDTO {
  @IsEmail()
  email: string;
  password: string;
}
