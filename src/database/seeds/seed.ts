import { NestFactory } from '@nestjs/core';
import { DataSource, EntityManager } from 'typeorm';
import { AppModule } from '../../app.module';
import { Address } from '../../address/entities/address.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { PropertyEntity } from '../../entities/entities/entity.entity';
import { Crop } from '../../crops/entities/crop.entity';
import { CropSeason } from '../../crop_seasons/entities/crop_season.entity';
import { CropSeasonCrop } from '../../crop_season_crops/entities/crop_season_crop.entity';

async function seed(manager: EntityManager): Promise<void> {
  const customersRepository = manager.getRepository(Customer);
  const addressesRepository = manager.getRepository(Address);
  const entitiesRepository = manager.getRepository(PropertyEntity);
  const cropsRepository = manager.getRepository(Crop);
  const cropSeasonsRepository = manager.getRepository(CropSeason);
  const cropSeasonCropsRepository = manager.getRepository(CropSeasonCrop);

  let customer = await customersRepository.findOneBy({
    document: '12345678901',
  });

  if (!customer) {
    customer = await customersRepository.save(
      customersRepository.create({
        document: '12345678901',
        name: 'Produtor João da Silva',
        email: 'joao.silva@example.com',
      }),
    );
  }

  const crops = new Map<string, Crop>();
  for (const name of ['Soja', 'Milho', 'Trigo', 'Feijão', 'Algodão']) {
    let crop = await cropsRepository.findOneBy({ name });

    if (!crop) {
      crop = await cropsRepository.save(cropsRepository.create({ name }));
    }

    crops.set(name, crop);
  }

  const farmConfigs = [
    {
      name: 'Fazenda Boqueirão',
      street: 'Da sede',
      number: '26',
      city: 'Lages',
      state: 'SC',
      zipCode: '88516120',
      totalArea: 900,
      agricultureArea: 700,
      vegetationArea: 200,
      plantings: [
        { year: '2025', crop: 'Soja', plantedArea: 300 },
        { year: '2025', crop: 'Milho', plantedArea: 200 },
        { year: '2026', crop: 'Soja', plantedArea: 400 },
        { year: '2026', crop: 'Milho', plantedArea: 200 },
        { year: '2026', crop: 'Trigo', plantedArea: 100 },
      ],
    },
    {
      name: 'Fazenda Santa Clara',
      street: 'Estrada do Pinheiro',
      number: '140',
      city: 'São Joaquim',
      state: 'SC',
      zipCode: '88600000',
      totalArea: 620,
      agricultureArea: 450,
      vegetationArea: 170,
      plantings: [
        { year: '2025', crop: 'Trigo', plantedArea: 180 },
        { year: '2025', crop: 'Feijão', plantedArea: 120 },
        { year: '2026', crop: 'Soja', plantedArea: 220 },
        { year: '2026', crop: 'Feijão', plantedArea: 130 },
      ],
    },
    {
      name: 'Fazenda Vale Verde',
      street: 'Rodovia SC-114',
      number: '850',
      city: 'Guarapuava',
      state: 'PR',
      zipCode: '85010000',
      totalArea: 780,
      agricultureArea: 560,
      vegetationArea: 220,
      plantings: [
        { year: '2025', crop: 'Milho', plantedArea: 250 },
        { year: '2025', crop: 'Algodão', plantedArea: 120 },
        { year: '2026', crop: 'Milho', plantedArea: 280 },
        { year: '2026', crop: 'Soja', plantedArea: 180 },
        { year: '2026', crop: 'Algodão', plantedArea: 80 },
      ],
    },
    {
      name: 'Fazenda Horizonte',
      street: 'Linha Horizonte',
      number: '45',
      city: 'Vacaria',
      state: 'RS',
      zipCode: '95200000',
      totalArea: 510,
      agricultureArea: 360,
      vegetationArea: 150,
      plantings: [
        { year: '2025', crop: 'Feijão', plantedArea: 140 },
        { year: '2025', crop: 'Trigo', plantedArea: 100 },
        { year: '2026', crop: 'Feijão', plantedArea: 160 },
        { year: '2026', crop: 'Trigo', plantedArea: 120 },
      ],
    },
    {
      name: 'Fazenda Campo Alto',
      street: 'Estrada Campo Alto',
      number: '310',
      city: 'Rio Verde',
      state: 'GO',
      zipCode: '75900000',
      totalArea: 1100,
      agricultureArea: 820,
      vegetationArea: 280,
      plantings: [
        { year: '2025', crop: 'Soja', plantedArea: 350 },
        { year: '2025', crop: 'Milho', plantedArea: 250 },
        { year: '2025', crop: 'Algodão', plantedArea: 100 },
        { year: '2026', crop: 'Soja', plantedArea: 450 },
        { year: '2026', crop: 'Milho', plantedArea: 250 },
        { year: '2026', crop: 'Algodão', plantedArea: 100 },
      ],
    },
  ];

  let seasonCount = 0;
  let plantingCount = 0;

  for (const farmConfig of farmConfigs) {
    let address = await addressesRepository.findOneBy({
      street: farmConfig.street,
      number: farmConfig.number,
      city: farmConfig.city,
      state: farmConfig.state,
      zipCode: farmConfig.zipCode,
    });

    if (!address) {
      address = await addressesRepository.save(
        addressesRepository.create({
          street: farmConfig.street,
          number: farmConfig.number,
          city: farmConfig.city,
          state: farmConfig.state,
          zipCode: farmConfig.zipCode,
        }),
      );
    }

    let farm = await entitiesRepository.findOne({
      where: {
        name: farmConfig.name,
        customer: { id: customer.id },
      },
    });

    if (!farm) {
      farm = await entitiesRepository.save(
        entitiesRepository.create({
          name: farmConfig.name,
          address,
          customer,
          totalArea: farmConfig.totalArea,
          agricultureArea: farmConfig.agricultureArea,
          vegetationArea: farmConfig.vegetationArea,
        }),
      );
    } else if (farm.address?.id !== address.id) {
      farm.address = address;
      farm = await entitiesRepository.save(farm);
    }

    const seasons = new Map<string, CropSeason>();
    for (const year of ['2025', '2026']) {
      let season = await cropSeasonsRepository.findOne({
        where: {
          entity: { id: farm.id },
          year,
        },
      });

      if (!season) {
        season = await cropSeasonsRepository.save(
          cropSeasonsRepository.create({
            entity: farm,
            year,
          }),
        );
      }

      seasons.set(year, season);
      seasonCount += 1;
    }

    for (const planting of farmConfig.plantings) {
      const season = seasons.get(planting.year);
      const crop = crops.get(planting.crop);

      if (!season || !crop) {
        throw new Error(
          `Seed relation not found for ${planting.year}/${planting.crop}`,
        );
      }

      const existing = await cropSeasonCropsRepository.findOne({
        where: {
          cropSeason: { id: season.id },
          crop: { id: crop.id },
        },
      });

      if (!existing) {
        await cropSeasonCropsRepository.save(
          cropSeasonCropsRepository.create({
            cropSeason: season,
            crop,
            plantedArea: planting.plantedArea,
          }),
        );
      }

      plantingCount += 1;
    }
  }

  console.log(
    `Seed completed: customer=${customer.id} farms=${farmConfigs.length} seasons=${seasonCount} crops=${crops.size} plantings=${plantingCount}`,
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const dataSource = app.get(DataSource);

  try {
    await dataSource.runMigrations();
    await dataSource.transaction(seed);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error('Seed failed', error);
  process.exitCode = 1;
});
