import { Controller, Post, Body, Get, Patch, Param, Query, Request } from '@nestjs/common';
import { IssueService } from '../services/issue.service';
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { CompareRevisionsDto } from '../dtos/compare-revisions.dto';
import { Issue } from '../entities/issue.entity';
import { Revision } from '../entities/revision.entity';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  createIssue(@Body() createIssueDto: CreateIssueDto, @Request() req: any): Promise<Issue> {
    return this.issueService.createIssue(createIssueDto, req.user.email);
  }

  @Get()
  findAllIssues(@Query('page') page: number, @Query('limit') limit: number): Promise<any> {
    return this.issueService.findAllIssues(page, limit);
  }

  @Patch(':id')
  updateIssue(@Param('id') id: number, @Body() updateIssueDto: UpdateIssueDto, @Request() req: any): Promise<Issue> {
    return this.issueService.updateIssue(id, updateIssueDto, req.user.email);
  }

  @Get(':id/revisions')
  findIssueRevisions(@Param('id') id: number): Promise<Revision[]> {
    return this.issueService.findIssueRevisions(id);
  }

  @Get(':id/compare')
  compareRevisions(@Param('id') id: number, @Query() compareRevisionsDto: CompareRevisionsDto): Promise<any> {
    return this.issueService.compareRevisions(id, compareRevisionsDto);
  }
}