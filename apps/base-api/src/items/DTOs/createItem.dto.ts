import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateItemDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsString()
  ownerId: string;
}
