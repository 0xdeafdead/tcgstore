import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateItemDTO {
  @ApiProperty({
    example: '$20.00',
    required: true,
    description: 'Price for the item. Can be a float',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  price: number;
  @ApiProperty({
    example: 'Sabo',
    required: true,
    description: 'The name from the item to be created',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
