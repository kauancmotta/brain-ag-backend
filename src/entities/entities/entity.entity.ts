import { Address } from 'src/address/entities/address.entity';
import { CropSeason } from 'src/crop_seasons/entities/crop_season.entity';
import { CustomerEntity } from 'src/customers/entities/customer-entity.entity';
import {
  Entity as EntityORM,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@EntityORM('entities')
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'address_id', type: 'uuid' })
  addressId!: string;

  @ManyToOne(() => Address, (address) => address.entities)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @Column({ name: 'total_area', type: 'decimal' })
  totalArea!: number;

  @Column({ name: 'agriculture_area', type: 'decimal' })
  agricultureArea!: number;

  @Column({ name: 'vegetation_area', type: 'decimal' })
  vegetationArea!: number;

  @OneToMany(() => CustomerEntity, (customerEntity) => customerEntity.entity)
  customerEntities!: CustomerEntity[];

  @OneToMany(() => CropSeason, (cropSeason) => cropSeason.entity)
  cropSeasons!: CropSeason[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
