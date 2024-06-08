import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateItemDTO {
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  @IsNotEmpty()
  name: string;
}
