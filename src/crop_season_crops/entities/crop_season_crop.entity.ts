import { CropSeason } from '@/src/crop_seasons/entities/crop_season.entity';
import { Crop } from '@/src/crops/entities/crop.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique('uq_crop_season_crop', ['cropSeason', 'crop'])
@Entity('crop_season_crops')
export class CropSeasonCrop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CropSeason, (cropSeason) => cropSeason.cropSeasonCrops, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'crop_season_id',
    foreignKeyConstraintName: 'fk_crop_season_crops_crop_season_id',
  })
  cropSeason!: CropSeason;

  @ManyToOne(() => Crop, (crop) => crop.cropSeasonCrops, { nullable: false })
  @JoinColumn({
    name: 'crop_id',
    foreignKeyConstraintName: 'fk_crop_season_crops_crop_id',
  })
  crop!: Crop;

  @Column({ name: 'planted_area', type: 'decimal' })
  plantedArea!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
