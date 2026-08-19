import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/src/address/dto/create-address.dto';

export class CreateEntityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: CreateAddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

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

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;
}
