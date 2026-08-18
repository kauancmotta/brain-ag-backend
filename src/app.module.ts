import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CustomersModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
