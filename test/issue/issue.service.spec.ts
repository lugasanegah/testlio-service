import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IssueService } from '../../src/domain/issue/services/issue.service';
import { Issue } from '../../src/domain/issue/entities/issue.entity';
import { Revision } from '../../src/domain/issue/entities/revision.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('IssueService', () => {
  let service: IssueService;
  let issueRepository: Repository<Issue>;
  let revisionRepository: Repository<Revision>;

  const mockIssue = {
    id: 1,
    title: 'Test Issue',
    description: 'This is a test issue',
    created_by: 'user@example.com',
    updated_by: 'user@example.com',
    updatedAt: new Date(),
    revisions: [], // Added to match Issue entity
  };

  const mockRevision = {
    id: 1,
    issueId: 1,
    issue: { title: 'Test Issue', description: 'This is a test issue' },
    changes: {},
    created_by: 'user@example.com',
    updatedAt: new Date(),
    issueEntity: mockIssue, // References mockIssue with revisions
  };

  // Update mockIssue to include mockRevision in revisions for consistency
  mockIssue.revisions = [mockRevision];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueService,
        {
          provide: getRepositoryToken(Issue),
          useValue: {
            create: jest.fn().mockReturnValue(mockIssue),
            save: jest.fn().mockResolvedValue(mockIssue),
            findAndCount: jest.fn().mockResolvedValue([[mockIssue], 1]),
            findOne: jest.fn().mockResolvedValue(mockIssue),
          },
        },
        {
          provide: getRepositoryToken(Revision),
          useValue: {
            create: jest.fn().mockReturnValue(mockRevision),
            save: jest.fn().mockResolvedValue(mockRevision),
            find: jest.fn().mockResolvedValue([mockRevision]),
          },
        },
      ],
    }).compile();

    service = module.get<IssueService>(IssueService);
    issueRepository = module.get<Repository<Issue>>(getRepositoryToken(Issue));
    revisionRepository = module.get<Repository<Revision>>(getRepositoryToken(Revision));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIssue', () => {
    it('should create and save an issue with a revision', async () => {
      const dto = { title: 'Test Issue', description: 'This is a test issue' };
      const createdBy = 'user@example.com';

      const result = await service.createIssue(dto, createdBy);

      expect(issueRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        description: dto.description,
        created_by: createdBy,
        updated_by: createdBy,
        revisions: [],
      });
      expect(issueRepository.save).toHaveBeenCalledWith(mockIssue);
      expect(revisionRepository.create).toHaveBeenCalledWith({
        issue: dto,
        changes: {},
        created_by: createdBy,
        updatedAt: expect.any(Date),
        issueEntity: mockIssue,
      });
      expect(revisionRepository.save).toHaveBeenCalledWith(mockRevision);
      expect(result).toEqual(mockIssue);
    });
  });

  describe('findAllIssues', () => {
    it('should return paginated issues', async () => {
      const page = 1;
      const limit = 10;

      const result = await service.findAllIssues(page, limit);

      expect(issueRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: limit,
      });
      expect(result).toEqual({
        data: [mockIssue],
        total: 1,
        page,
        limit,
      });
    });
  });

  describe('updateIssue', () => {
    it('should update an issue and create a revision if changed', async () => {
      const id = 1;
      const dto = { title: 'Updated Issue', description: 'Updated description' };
      const updatedBy = 'user@example.com';

      const result = await service.updateIssue(id, dto, updatedBy);

      expect(issueRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(issueRepository.save).toHaveBeenCalledWith({
        ...mockIssue,
        title: dto.title,
        description: dto.description,
        updated_by: updatedBy,
      });
      expect(revisionRepository.create).toHaveBeenCalledWith({
        issue: { title: dto.title, description: dto.description },
        changes: { title: dto.title, description: dto.description },
        created_by: updatedBy,
        updatedAt: expect.any(Date),
        issueEntity: mockIssue,
      });
      expect(revisionRepository.save).toHaveBeenCalledWith(mockRevision);
      expect(result).toEqual(mockIssue);
    });

    it('should throw NotFoundException if issue not found', async () => {
      jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateIssue(1, {}, 'user@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findIssueRevisions', () => {
    it('should return revisions for an issue', async () => {
      const id = 1;

      const result = await service.findIssueRevisions(id);

      expect(revisionRepository.find).toHaveBeenCalledWith({
        where: { issueId: id },
        order: { updatedAt: 'ASC' },
      });
      expect(result).toEqual([mockRevision]);
    });
  });

  describe('compareRevisions', () => {
    it('should compare two revisions and return differences', async () => {
      const id = 1;
      const dto = { revisionA: 1, revisionB: 2 };
      const revA = {
        ...mockRevision,
        id: 1,
        issue: { title: 'Test', description: 'Old' },
      };
      const revB = {
        ...mockRevision,
        id: 2,
        issue: { title: 'Test', description: 'New' },
      };
      jest.spyOn(revisionRepository, 'find').mockResolvedValue([revA, revB]);

      const result = await service.compareRevisions(id, dto);

      expect(revisionRepository.find).toHaveBeenCalledWith({
        where: { issueId: id },
        order: { updatedAt: 'ASC' },
      });
      expect(result).toEqual({
        before: revA.issue,
        after: revB.issue,
        changes: { description: { before: 'Old', after: 'New' } },
        revisions: [revA, revB],
      });
    });

    it('should throw NotFoundException if revisions not found', async () => {
      const id = 1;
      const dto = { revisionA: 1, revisionB: 999 };
      jest.spyOn(revisionRepository, 'find').mockResolvedValue([mockRevision]);

      await expect(service.compareRevisions(id, dto)).rejects.toThrow(NotFoundException);
    });
  });
});