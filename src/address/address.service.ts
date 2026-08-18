import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.addressRepository.softDelete(id);
  }
}
