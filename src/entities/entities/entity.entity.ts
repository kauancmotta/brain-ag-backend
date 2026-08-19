import { Address } from '@/src/address/entities/address.entity';
import { CropSeason } from '@/src/crop_seasons/entities/crop_season.entity';
import { Customer } from '@/src/customers/entities/customer.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Check,
} from 'typeorm';

@Check(
  'CHK_entities_areas',
  '"agriculture_area" + "vegetation_area" <= "total_area"',
)
@Entity('entities')
export class PropertyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Address, (address) => address.entities, {
    cascade: ['insert'],
    eager: true,
  })
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @ManyToOne(() => Customer, (customer) => customer.entities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
    foreignKeyConstraintName: 'fk_entities_customer_id',
  })
  customer!: Customer;

  @Column({ name: 'total_area', type: 'decimal' })
  totalArea!: number;

  @Column({ name: 'agriculture_area', type: 'decimal' })
  agricultureArea!: number;

  @Column({ name: 'vegetation_area', type: 'decimal' })
  vegetationArea!: number;

  @OneToMany(() => CropSeason, (cropSeason) => cropSeason.entity, {
    cascade: ['remove'],
  })
  cropSeasons!: CropSeason[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
