import { Test, TestingModule } from '@nestjs/testing';
import { IssueController } from '../../src/domain/issue/controllers/issue.controller';
import { IssueService } from '../../src/domain/issue/services/issue.service';
import { CreateIssueDto } from '../../src/domain/issue/dtos/create-issue.dto';
import { UpdateIssueDto } from '../../src/domain/issue/dtos/update-issue.dto';
import { CompareRevisionsDto } from '../../src/domain/issue/dtos/compare-revisions.dto';

describe('IssueController', () => {
  let controller: IssueController;
  let issueService: IssueService;

  const mockIssue = {
    id: 1,
    title: 'Test Issue',
    description: 'This is a test issue',
    created_by: 'user@example.com',
    updated_by: 'user@example.com',
    updatedAt: new Date(),
  };

  const mockRevision = {
    id: 1,
    issueId: 1,
    issue: { title: 'Test Issue', description: 'This is a test issue' },
    changes: {},
    created_by: 'user@example.com',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueController],
      providers: [
        {
          provide: IssueService,
          useValue: {
            createIssue: jest.fn().mockResolvedValue(mockIssue),
            findAllIssues: jest.fn().mockResolvedValue({
              data: [mockIssue],
              total: 1,
              page: 1,
              limit: 10,
            }),
            updateIssue: jest.fn().mockResolvedValue(mockIssue),
            findIssueRevisions: jest.fn().mockResolvedValue([mockRevision]),
            compareRevisions: jest.fn().mockResolvedValue({
              before: mockRevision.issue,
              after: mockRevision.issue,
              changes: {},
              revisions: [mockRevision],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<IssueController>(IssueController);
    issueService = module.get<IssueService>(IssueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createIssue', () => {
    it('should create an issue', async () => {
      const dto = new CreateIssueDto();
      dto.title = 'Test Issue';
      dto.description = 'This is a test issue';
      const req = { user: { email: 'user@example.com' } };

      const result = await controller.createIssue(dto, req);

      expect(issueService.createIssue).toHaveBeenCalledWith(dto, req.user.email);
      expect(result).toEqual(mockIssue);
    });
  });

  describe('findAllIssues', () => {
    it('should return paginated issues', async () => {
      const page = 1;
      const limit = 10;

      const result = await controller.findAllIssues(page, limit);

      expect(issueService.findAllIssues).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual({
        data: [mockIssue],
        total: 1,
        page,
        limit,
      });
    });
  });

  describe('updateIssue', () => {
    it('should update an issue', async () => {
      const id = 1;
      const dto = new UpdateIssueDto();
      dto.title = 'Updated Issue';
      const req = { user: { email: 'user@example.com' } };

      const result = await controller.updateIssue(id, dto, req);

      expect(issueService.updateIssue).toHaveBeenCalledWith(id, dto, req.user.email);
      expect(result).toEqual(mockIssue);
    });
  });

  describe('findIssueRevisions', () => {
    it('should return revisions for an issue', async () => {
      const id = 1;

      const result = await controller.findIssueRevisions(id);

      expect(issueService.findIssueRevisions).toHaveBeenCalledWith(id);
      expect(result).toEqual([mockRevision]);
    });
  });

  describe('compareRevisions', () => {
    it('should compare revisions', async () => {
      const id = 1;
      const dto = new CompareRevisionsDto();
      dto.revisionA = 1;
      dto.revisionB = 2;

      const result = await controller.compareRevisions(id, dto);

      expect(issueService.compareRevisions).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual({
        before: mockRevision.issue,
        after: mockRevision.issue,
        changes: {},
        revisions: [mockRevision],
      });
    });
  });
});