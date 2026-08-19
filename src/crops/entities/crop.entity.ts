import { CropSeasonCrop } from '@/src/crop_season_crops/entities/crop_season_crop.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique('uq_crops_name', ['name'])
@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => CropSeasonCrop, (cropSeasonCrop) => cropSeasonCrop.crop)
  cropSeasonCrops!: CropSeasonCrop[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
