import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  document!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
