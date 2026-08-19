import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

describe('AddressController', () => {
  let controller: AddressController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [{ provide: AddressService, useValue: service }],
    }).compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to service', () => {
    const dto = { street: 'Main St', city: 'São Paulo', zipCode: '01000-000' };
    controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate update and remove to service', () => {
    const dto = { city: 'Curitiba' };

    controller.update('address-1', dto);
    controller.remove('address-1');

    expect(service.update).toHaveBeenCalledWith('address-1', dto);
    expect(service.remove).toHaveBeenCalledWith('address-1');
  });
});
