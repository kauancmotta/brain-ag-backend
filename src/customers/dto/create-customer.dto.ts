import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsDocument } from '@/src/validators/is-document.decorator';
export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDocument()
  document!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
