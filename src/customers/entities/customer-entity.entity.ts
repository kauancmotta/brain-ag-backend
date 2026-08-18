import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity as EntityORM,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Entity } from 'src/entities/entities/entity.entity';

@EntityORM('customer_entities')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Customer, (customer) => customer.customerEntities)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @ManyToOne(() => Entity, (entity) => entity.customerEntities)
  @JoinColumn({
    name: 'entity_id',
    foreignKeyConstraintName: 'fk_customers_entity_id',
  })
  entity!: Entity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
