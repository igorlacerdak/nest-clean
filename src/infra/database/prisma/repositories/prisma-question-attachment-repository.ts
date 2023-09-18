import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachment = await this.prisma.attachment.findMany({
      where: { questionId },
    });

    if (!questionAttachment) {
      return [];
    }

    return questionAttachment.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  public async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
