import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateItemDTO {
  @ApiProperty({
    example: 'Sabo',
    required: true,
    description: 'The name from the item to be created',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
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
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    required: true,
    description: 'Id of the item seller',
    minLength: 36,
    maxLength: 36,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @MinLength(36)
  @MaxLength(36)
  ownerId: string;
}
