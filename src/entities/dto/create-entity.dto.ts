import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEntityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  addressId!: string;

  @ApiProperty({
    example: 150.25,
    description: 'Total entity area in hectares',
  })
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalArea!: number;

  @ApiProperty({
    example: 100.5,
    description: 'Agricultural area in hectares',
  })
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  agricultureArea!: number;

  @ApiProperty({
    example: 49.75,
    description: 'Vegetation area in hectares',
  })
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  vegetationArea!: number;
}
