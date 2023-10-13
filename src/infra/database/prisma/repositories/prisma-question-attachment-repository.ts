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

  public async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  public async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString();
    });

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }
}
