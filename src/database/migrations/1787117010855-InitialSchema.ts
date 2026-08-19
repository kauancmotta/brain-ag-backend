import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787117010855 implements MigrationInterface {
    name = 'InitialSchema1787117010855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "crops" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_crops_name" UNIQUE ("name"), CONSTRAINT "PK_098dbeb7c803dc7c08a7f02b805" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crop_season_crops" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planted_area" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "crop_season_id" uuid NOT NULL, "crop_id" uuid NOT NULL, CONSTRAINT "uq_crop_season_crop" UNIQUE ("crop_season_id", "crop_id"), CONSTRAINT "PK_f0324ca1c3cd1c640c847167c8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crop_seasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "entity_id" uuid NOT NULL, CONSTRAINT "uq_entity_crop_season_year" UNIQUE ("entity_id", "year"), CONSTRAINT "PK_d4ac8a47c6fd84757663b9a9697" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6" UNIQUE ("document"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "total_area" numeric NOT NULL, "agriculture_area" numeric NOT NULL, "vegetation_area" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "address_id" uuid, "customer_id" uuid NOT NULL, CONSTRAINT "CHK_entities_areas" CHECK ("agriculture_area" + "vegetation_area" <= "total_area"), CONSTRAINT "PK_8640855ae82083455cbb806173d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "number" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "crop_season_crops" ADD CONSTRAINT "fk_crop_season_crops_crop_season_id" FOREIGN KEY ("crop_season_id") REFERENCES "crop_seasons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crop_season_crops" ADD CONSTRAINT "fk_crop_season_crops_crop_id" FOREIGN KEY ("crop_id") REFERENCES "crops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crop_seasons" ADD CONSTRAINT "fk_crop_seasons_entity_id" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entities" ADD CONSTRAINT "FK_17f80861aeaf6d6b6b783a000a5" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entities" ADD CONSTRAINT "fk_entities_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entities" DROP CONSTRAINT "fk_entities_customer_id"`);
        await queryRunner.query(`ALTER TABLE "entities" DROP CONSTRAINT "FK_17f80861aeaf6d6b6b783a000a5"`);
        await queryRunner.query(`ALTER TABLE "crop_seasons" DROP CONSTRAINT "fk_crop_seasons_entity_id"`);
        await queryRunner.query(`ALTER TABLE "crop_season_crops" DROP CONSTRAINT "fk_crop_season_crops_crop_id"`);
        await queryRunner.query(`ALTER TABLE "crop_season_crops" DROP CONSTRAINT "fk_crop_season_crops_crop_season_id"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "entities"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "crop_seasons"`);
        await queryRunner.query(`DROP TABLE "crop_season_crops"`);
        await queryRunner.query(`DROP TABLE "crops"`);
    }

}
