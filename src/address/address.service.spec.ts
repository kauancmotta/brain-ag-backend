import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

describe('AddressService', () => {
  let service: AddressService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    softDelete: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an address', async () => {
    const dto = { street: 'Main St', city: 'São Paulo', zipCode: '01000-000' };
    const address = { id: '1', ...dto };

    repo.create.mockReturnValue(address);
    repo.save.mockResolvedValue(address);

    await expect(service.create(dto as any)).resolves.toEqual(address);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(address);
  });

  it('should throw when address is not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should list, update, and soft-delete addresses', async () => {
    const address = { id: 'address-1', city: 'São Paulo' };
    repo.find.mockResolvedValue([address]);
    repo.findOne.mockResolvedValue(address);
    repo.save.mockResolvedValue({ ...address, city: 'Curitiba' });

    await expect(service.findAll()).resolves.toEqual([address]);
    await expect(service.update('address-1', { city: 'Curitiba' } as any))
      .resolves.toMatchObject({ city: 'Curitiba' });
    await expect(service.remove('address-1')).resolves.toBeUndefined();
    expect(repo.softDelete).toHaveBeenCalledWith('address-1');
  });
});
