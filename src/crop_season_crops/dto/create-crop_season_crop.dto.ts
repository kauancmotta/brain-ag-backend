import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateCropSeasonCropDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  cropSeasonId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  cropId!: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  plantedArea!: number;
}
