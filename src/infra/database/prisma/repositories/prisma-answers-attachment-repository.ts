import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';

@Injectable()
export class PrismaAnswersAttachmentRepository
  implements AnswerAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  public async findManyByAnswerId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    const answerAttachment = await this.prisma.attachment.findMany({
      where: { answerId },
    });

    if (!answerAttachment) {
      return [];
    }

    return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  public async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}
