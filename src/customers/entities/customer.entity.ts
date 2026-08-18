import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer-entity.entity';

@Entity('customers')
export class Customer {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  document!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(
    () => CustomerEntity,
    (customerEntity) => customerEntity.customer,
  )
  customerEntities!: CustomerEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
