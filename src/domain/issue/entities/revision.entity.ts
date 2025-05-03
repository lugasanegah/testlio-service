import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class Revision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issueId: number;

  @Column('jsonb')
  issue: { title: string; description: string };

  @Column('jsonb')
  changes: { [key: string]: string };

  @Column()
  created_by: string;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => Issue, (issue) => issue.revisions)
  issueEntity: Issue;
}