import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PropertyEntity } from '../entities/entities/entity.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: { getDashboard: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: { getDashboard: jest.fn() },
        },
        {
          provide: getRepositoryToken(PropertyEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CropSeasonCrop),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should forward the year filter to the service', () => {
    const query = { year: '2026' };

    controller.getDashboard(query);

    expect(service.getDashboard).toHaveBeenCalledWith('2026');
  });

  it('should validate the year filter as YYYY', async () => {
    const invalidQuery = Object.assign(new DashboardQueryDto(), {
      year: '26',
    });
    const validQuery = Object.assign(new DashboardQueryDto(), {
      year: '2026',
    });

    await expect(validate(invalidQuery)).resolves.not.toHaveLength(0);
    await expect(validate(validQuery)).resolves.toHaveLength(0);
  });
});
