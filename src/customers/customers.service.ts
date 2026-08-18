import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return this.customersRepository.create(createCustomerDto);
  }

  findAll() {
    return this.customersRepository.find();
  }

  findOne(id: string) {
    return this.customersRepository.findOne({ where: { id } });
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customersRepository.update(id, updateCustomerDto);
  }

  remove(id: string) {
    return this.customersRepository.softDelete(id)
  }

  restore(id: string) {
    return this.customersRepository.restore(id)
  }
}
