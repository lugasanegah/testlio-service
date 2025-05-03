import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './services/issue.service';
import { IssueController } from './controllers/issue.controller';
import { Issue } from './entities/issue.entity';
import { Revision } from './entities/revision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Revision])],
  providers: [IssueService],
  controllers: [IssueController],
})
export class IssueModule {}