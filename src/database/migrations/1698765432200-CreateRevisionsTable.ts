import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRevisionsTable1698765432200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'revision',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'issueId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'issue',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'changes',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'revision',
      new TableForeignKey({
        columnNames: ['issueId'],
        referencedTableName: 'issue',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('revision');
  }
}