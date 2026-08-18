import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}
