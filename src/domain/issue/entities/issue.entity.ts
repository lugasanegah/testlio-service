import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Revision } from './revision.entity';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @OneToMany(() => Revision, (revision) => revision.issue)
  revisions: Revision[];
}