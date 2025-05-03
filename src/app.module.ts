import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { IssueModule } from './domain/issue/issue.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    IssueModule,
  ],
})
export class AppModule {}