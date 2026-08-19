import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomerResponseMapper } from './mappers/customer-response.mapper';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  private async validateUniqueCustomer(
    document?: string,
    email?: string,
    excludeId?: string,
  ): Promise<void> {
    if (document) {
      const existingDocument = await this.customersRepository.findOne({
        where: { document },
        withDeleted: true,
      });

      if (existingDocument && existingDocument.id !== excludeId) {
        throw new ConflictException(
          'Customer with this document already exists',
        );
      }
    }

    if (email) {
      const existingEmail = await this.customersRepository.findOne({
        where: { email },
        withDeleted: true,
      });

      if (existingEmail && existingEmail.id !== excludeId) {
        throw new ConflictException('Customer with this email already exists');
      }
    }
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    await this.validateUniqueCustomer(
      createCustomerDto.document,
      createCustomerDto.email,
    );

    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customersRepository.find({
      relations: { entities: true },
    });

    return customers.map((customer) =>
      CustomerResponseMapper.toResponse(customer),
    );
  }

  async findOne(id: string): Promise<CustomerResponseDto> {
    const customer = await this.findCustomer(id);

    return CustomerResponseMapper.toResponse(customer);
  }

  private async findCustomer(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: {
        entities: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findCustomer(id);

    Object.assign(customer, updateCustomerDto);

    return this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.customersRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.customersRepository.restore(id);
  }
}
