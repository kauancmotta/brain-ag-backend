import { CustomerResponseDto } from '../dto/customer-response.dto';
import { Customer } from '../entities/customer.entity';

export class CustomerResponseMapper {
  static toResponse(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      document: customer.document,
      name: customer.name,
      email: customer.email,

      properties: customer.entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
      })),
    };
  }
}
