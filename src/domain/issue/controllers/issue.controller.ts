import { Controller, Post, Body, Get, Patch, Param, Query, Request, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { IssueService } from '../services/issue.service';
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { CompareRevisionsDto } from '../dtos/compare-revisions.dto';
import { Issue } from '../entities/issue.entity';
import { Revision } from '../entities/revision.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@Controller('issues')
@ApiTags('Issues')
@ApiBearerAuth('JWT')
@ApiSecurity('X-Client-ID')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiBody({ type: CreateIssueDto })
  @ApiResponse({
    status: 201,
    description: 'Issue created successfully',
    type: Issue,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    example: { statusCode: 400, message: 'Validation failed', error: 'Bad Request' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: { statusCode: 401, message: 'Invalid token', error: 'Unauthorized' },
  })
  createIssue(@Body() createIssueDto: CreateIssueDto, @Request() req: any): Promise<Issue> {
    return this.issueService.createIssue(createIssueDto, req.user.email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a paginated list of issues' })
  @ApiQuery({ name: 'page', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of issues',
    type: Object,
    example: {
      data: [{ id: 1, title: 'Test Issue', description: 'This is a test issue', created_by: 'user@example.com', updated_by: 'user@example.com', updatedAt: '2025-05-03T07:03:30.565Z' }],
      total: 1,
      page: 1,
      limit: 10,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: { statusCode: 401, message: 'Invalid token', error: 'Unauthorized' },
  })
  findAllIssues(@Query('page') page: number, @Query('limit') limit: number): Promise<any> {
    return this.issueService.findAllIssues(page, limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an issue' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateIssueDto })
  @ApiResponse({
    status: 200,
    description: 'Issue updated successfully',
    type: Issue,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    example: { statusCode: 400, message: 'Validation failed', error: 'Bad Request' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: { statusCode: 401, message: 'Invalid token', error: 'Unauthorized' },
  })
  @ApiResponse({
    status: 404,
    description: 'Issue not found',
    example: { statusCode: 404, message: 'Issue not found', error: 'Not Found' },
  })
  updateIssue(@Param('id') id: number, @Body() updateIssueDto: UpdateIssueDto, @Request() req: any): Promise<Issue> {
    return this.issueService.updateIssue(id, updateIssueDto, req.user.email);
  }

  @Get(':id/revisions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get revisions for an issue' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of revisions',
    type: [Revision],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: { statusCode: 401, message: 'Invalid token', error: 'Unauthorized' },
  })
  findIssueRevisions(@Param('id') id: number): Promise<Revision[]> {
    return this.issueService.findIssueRevisions(id);
  }

  @Get(':id/compare')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Compare two revisions of an issue' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiQuery({ name: 'revisionA', type: Number, example: 1 })
  @ApiQuery({ name: 'revisionB', type: Number, example: 3 })
  @ApiResponse({
    status: 200,
    description: 'Comparison of revisions',
    type: Object,
    example: {
      before: { title: 'Test', description: 'test test' },
      after: { title: 'Test', description: 'hola hola' },
      changes: { description: { before: 'test test', after: 'hola hola' } },
      revisions: [
        { id: 1, issueId: 1, issue: { title: 'Test', description: 'test test' }, changes: {}, created_by: 'user@example.com', updatedAt: '2025-05-03T07:03:30.565Z' },
        { id: 3, issueId: 1, issue: { title: 'Test', description: 'hola hola' }, changes: {}, created_by: 'user@example.com', updatedAt: '2025-05-03T07:11:30.232Z' },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    example: { statusCode: 400, message: 'Validation failed', error: 'Bad Request' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: { statusCode: 401, message: 'Invalid token', error: 'Unauthorized' },
  })
  @ApiResponse({
    status: 404,
    description: 'Revisions not found',
    example: { statusCode: 404, message: 'Revision not found', error: 'Not Found' },
  })
  compareRevisions(@Param('id') id: number, @Query() compareRevisionsDto: CompareRevisionsDto): Promise<any> {
    return this.issueService.compareRevisions(id, compareRevisionsDto);
  }
}