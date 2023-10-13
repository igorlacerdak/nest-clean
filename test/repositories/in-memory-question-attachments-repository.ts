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

  public async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  public async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachment = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachment;
  }
}
