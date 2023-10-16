import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByAnswerId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const questions = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map((question) => PrismaAnswerMapper.toDomain(question));
  }

  async create(answer: Answer): Promise<void> {
    const data = await PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),

      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
