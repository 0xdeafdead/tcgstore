import { IsEmail } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;
  password: string;
}
