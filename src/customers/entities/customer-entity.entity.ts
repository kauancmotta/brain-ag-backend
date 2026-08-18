import {
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { PropertyEntity } from 'src/entities/entities/entity.entity';

@Entity('customer_entities')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Customer, (customer) => customer.customerEntities)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @ManyToOne(() => PropertyEntity, (propertyEntity) => propertyEntity.customerEntities)
  @JoinColumn({
    name: 'entity_id',
    foreignKeyConstraintName: 'fk_customers_entity_id',
  })
  entity!: PropertyEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
