import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'johndoe@example.com',
    required: true,
    description: 'The unique email for the user',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'JohnDoe',
    required: true,
    description: 'The public username for user.',
    minLength: 3,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
