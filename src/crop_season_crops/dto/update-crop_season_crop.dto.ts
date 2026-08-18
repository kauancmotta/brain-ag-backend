import { PartialType } from '@nestjs/mapped-types';
import { CreateCropSeasonCropDto } from './create-crop_season_crop.dto';

export class UpdateCropSeasonCropDto extends PartialType(CreateCropSeasonCropDto) {}
