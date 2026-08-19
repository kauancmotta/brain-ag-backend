import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { PropertyEntity } from '@/src/entities/entities/entity.entity';
import { CropSeasonCrop } from '@/src/crop_season_crops/entities/crop_season_crop.entity';

@Unique('uq_entity_crop_season_year', ['entity', 'year'])
@Entity('crop_seasons')
export class CropSeason {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PropertyEntity, (entity) => entity.cropSeasons, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'entity_id',
    foreignKeyConstraintName: 'fk_crop_seasons_entity_id',
  })
  entity!: PropertyEntity;

  @Column()
  year!: string;

  @OneToMany(
    () => CropSeasonCrop,
    (cropSeasonCrop) => cropSeasonCrop.cropSeason,
    { cascade: ['remove'] },
  )
  cropSeasonCrops!: CropSeasonCrop[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
