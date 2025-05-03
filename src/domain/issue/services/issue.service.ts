import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { Revision } from '../entities/revision.entity';
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { CompareRevisionsDto } from '../dtos/compare-revisions.dto';
import { ISSUE_CONSTANTS} from '../contants/issue.constants';


@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(Revision)
    private revisionRepository: Repository<Revision>,
  ) {}

  async createIssue(dto: CreateIssueDto, createdBy: string): Promise<Issue> {
    const issue = this.issueRepository.create({
      ...dto,
      created_by: createdBy,
    });
    const savedIssue = await this.issueRepository.save(issue);

    await this.revisionRepository.save({
      issueId: savedIssue.id,
      issue: { title: savedIssue.title, description: savedIssue.description },
      changes: { title: savedIssue.title, description: savedIssue.description },
      created_by: createdBy,
      updatedAt: new Date(),
    });

    return savedIssue;
  }

  async findAllIssues(page: number, limit: number): Promise<any> {
    page = page || ISSUE_CONSTANTS.DEFAULT_PAGE;
    limit = limit || ISSUE_CONSTANTS.DEFAULT_LIMIT;
    const [issues, total] = await this.issueRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: issues,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateIssue(id: number, dto: UpdateIssueDto, updatedBy: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne({ where: { id } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const changes: { [key: string]: string } = {};
    if (dto.title) {
      issue.title = dto.title;
      changes.title = dto.title;
    }
    if (dto.description) {
      issue.description = dto.description;
      changes.description = dto.description;
    }
    issue.updated_by = updatedBy;

    const savedIssue = await this.issueRepository.save(issue);

    if (Object.keys(changes).length > 0) {
      await this.revisionRepository.save({
        issueId: savedIssue.id,
        issue: { title: savedIssue.title, description: savedIssue.description },
        changes,
        created_by: updatedBy,
        updatedAt: new Date(),
      });
    }

    return savedIssue;
  }

  async findIssueRevisions(id: number): Promise<Revision[]> {
    return this.revisionRepository.find({
      where: { issueId: id },
      order: { updatedAt: 'ASC' },
    });
  }

  async compareRevisions(id: number, dto: CompareRevisionsDto): Promise<any> {
    const revisions = await this.revisionRepository.find({
      where: { issueId: id },
      order: { updatedAt: 'ASC' },
    });

    if (!revisions.length) {
      throw new NotFoundException('No revisions found for this issue');
    }

    const revA = revisions.find((r) => r.id === dto.revisionA);
    const revB = revisions.find((r) => r.id === dto.revisionB);

    if (!revA || !revB) {
      throw new NotFoundException(`Revision not found: revisionA=${dto.revisionA}, revisionB=${dto.revisionB}`);
    }

    const changes: { [key: string]: { before: string; after: string } } = {};
    for (const key of Object.keys(revA.issue)) {
      if (revA.issue[key] !== revB.issue[key]) {
        changes[key] = {
          before: revA.issue[key],
          after: revB.issue[key],
        };
      }
    }

    const revAIndex = revisions.findIndex((r) => r.id === dto.revisionA);
    const revBIndex = revisions.findIndex((r) => r.id === dto.revisionB);

    // Determine the order (older-to-newer or newer-to-older)
    const startIndex = Math.min(revAIndex, revBIndex);
    const endIndex = Math.max(revAIndex, revBIndex);
    const revisionTrail = revisions.slice(startIndex, endIndex + 1);

    // If revB is older than revA, swap before/after to reflect newer-to-older comparison
    const isNewerToOlder = revBIndex < revAIndex;
    return {
      before: isNewerToOlder ? revB.issue : revA.issue,
      after: isNewerToOlder ? revA.issue : revB.issue,
      changes: isNewerToOlder
        ? Object.fromEntries(
          Object.entries(changes).map(([key, value]) => [key, { before: value.after, after: value.before }]),
        )
        : changes,
      revisions: revisionTrail,
    };
  }
}