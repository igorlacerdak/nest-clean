import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachment;
  }

  public async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachment;
  }
}
