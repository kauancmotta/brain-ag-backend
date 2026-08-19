import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateCropSeasonDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({
    example: '2026',
    description: 'Crop season year in YYYY format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, {
    message: 'year must contain exactly 4 digits',
  })
  year!: string;
}
