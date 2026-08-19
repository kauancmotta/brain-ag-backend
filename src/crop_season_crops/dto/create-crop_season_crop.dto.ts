import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

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
  @IsDefined()
  @IsNumber()
  @Min(0)
  plantedArea!: number;
}
