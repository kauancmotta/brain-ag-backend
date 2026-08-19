import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyEntity } from '@/src/entities/entities/entity.entity';

@Entity('addresses')
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

  @OneToMany(() => PropertyEntity, (propertyEntity) => propertyEntity.address)
  entities!: PropertyEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
