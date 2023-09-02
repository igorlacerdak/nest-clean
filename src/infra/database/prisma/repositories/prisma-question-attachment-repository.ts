import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.');
  }

  public async deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
