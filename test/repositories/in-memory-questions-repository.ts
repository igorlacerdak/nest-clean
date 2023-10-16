import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  public async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  public async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  public async findDetailsBySlug(
    slug: string,
  ): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exits `,
      );
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachemnt) => {
        return questionAttachemnt.questionId.equals(question.id);
      },
    );

    const attachments = questionAttachments.map((questionAttachemnt) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachemnt.attachmentId);
      });

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachemnt}" does not exits `,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  public async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  public async create(question: Question): Promise<void> {
    this.items.push(question);

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  public async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  public async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
