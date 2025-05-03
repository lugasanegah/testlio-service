import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Issue } from '../domain/issue/entities/issue.entity';
import { Revision } from '../domain/issue/entities/revision.entity';

const configService = new ConfigService();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'db'),
  port: parseInt(configService.get<string>('DATABASE_PORT', '5432'), 10),
  username: configService.get<string>('DATABASE_USER', 'root'),
  password: configService.get<string>('DATABASE_PASSWORD', 'your_password'),
  database: configService.get<string>('DATABASE_NAME', 'testlio'),
  entities: [Issue, Revision],
  migrations: ['dist/database/migrations/*.{js,ts}'],
  migrationsRun: false,
  synchronize: false,
};