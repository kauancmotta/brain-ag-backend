import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerEntity } from './entities/customer-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerEntity])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
