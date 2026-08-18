import { CropSeason } from 'src/crop_seasons/entities/crop_season.entity';
import { Crop } from 'src/crops/entities/crop.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('crop_season_crops')
export class CropSeasonCrop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'crop_season_id', type: 'uuid' })
  cropSeasonId!: string;

  @ManyToOne(() => CropSeason, (cropSeason) => cropSeason.cropSeasonCrops, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'crop_season_id' })
  cropSeason!: CropSeason;

  @Column({ name: 'crop_id', type: 'uuid' })
  cropId!: string;

  @ManyToOne(() => Crop, (crop) => crop.cropSeasonCrops)
  @JoinColumn({ name: 'crop_id' })
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
