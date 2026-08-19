import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let customersRepository: {
    findOne: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    softDelete: jest.Mock;
    restore: jest.Mock;
  };
  beforeEach(async () => {
    customersRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: customersRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject duplicate document', async () => {
    customersRepository.findOne.mockResolvedValue({
      id: 'customer-1',
      document: '123',
    });

    await expect(
      service.create({
        document: '123',
        name: 'Ana',
        email: 'ana@test.com',
      } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should load a customer with its entities', async () => {
    const customer = {
      id: 'customer-1',
      document: '123',
      name: 'Ana',
      email: 'ana@test.com',
      entities: [{ id: 'entity-1', name: 'Farm' }],
    };
    customersRepository.findOne.mockResolvedValue(customer);

    await expect(service.findOne('customer-1')).resolves.toMatchObject({
      id: 'customer-1',
      properties: [{ id: 'entity-1', name: 'Farm' }],
    });
    expect(customersRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'customer-1' },
      relations: { entities: true },
    });
  });
});
