import {
  Column,
  Entity as EntityORM,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'src/entities/entities/entity.entity';

@EntityORM('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ name: 'zip_code' })
  zipCode!: string;

  @OneToMany(() => Entity, (entity) => entity.address)
  entities!: Entity[];
}
