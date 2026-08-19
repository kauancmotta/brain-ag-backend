import { CustomerPropertyResponseDto } from './customer-entity-response.dto';

export class CustomerResponseDto {
  id!: string;
  document!: string;
  name!: string;
  email!: string;
  properties!: CustomerPropertyResponseDto[];
}
