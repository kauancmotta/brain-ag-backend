import { OmitType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends OmitType(CreateCustomerDto, [
  'document',
  'email',
]) {}
