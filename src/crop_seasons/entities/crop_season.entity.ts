import {
  Entity as EntityORM,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Entity } from 'src/entities/entities/entity.entity';
import { CropSeasonCrop } from 'src/crop_season_crops/entities/crop_season_crop.entity';

@EntityORM('crop_seasons')
export class CropSeason {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId!: string;

  @ManyToOne(() => Entity, (entity) => entity.cropSeasons)
  @JoinColumn({ name: 'entity_id' })
  entity!: Entity;

  @Column()
  name!: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate!: Date;

  @OneToMany(
    () => CropSeasonCrop,
    (cropSeasonCrop) => cropSeasonCrop.cropSeason,
  )
  cropSeasonCrops!: CropSeasonCrop[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
