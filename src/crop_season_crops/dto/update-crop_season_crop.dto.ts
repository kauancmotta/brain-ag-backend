import { IsNumber, Min } from 'class-validator';

export class UpdateCropSeasonCropDto {
  @IsNumber()
  @Min(0)
  plantedArea!: number;
}
