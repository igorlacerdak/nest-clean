import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public async findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }

  public async findManyByQuesitonId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }

  public async create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}