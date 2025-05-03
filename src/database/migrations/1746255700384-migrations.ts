import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746255700384 implements MigrationInterface {
    name = 'Migrations1746255700384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revision" DROP CONSTRAINT "FK_5d2621aceeff82595b1211f63d8"`);
        await queryRunner.query(`ALTER TABLE "revision" ADD "issueEntityId" integer`);
        await queryRunner.query(`ALTER TABLE "revision" ADD CONSTRAINT "FK_ce670de2e4ff4b7dc3dc64dc420" FOREIGN KEY ("issueEntityId") REFERENCES "issue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revision" DROP CONSTRAINT "FK_ce670de2e4ff4b7dc3dc64dc420"`);
        await queryRunner.query(`ALTER TABLE "revision" DROP COLUMN "issueEntityId"`);
        await queryRunner.query(`ALTER TABLE "revision" ADD CONSTRAINT "FK_5d2621aceeff82595b1211f63d8" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
