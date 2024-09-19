import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724773450331 implements MigrationInterface {
    name = 'Migration1724773450331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roles\` \`roles\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roles\` \`roles\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
    }

}
