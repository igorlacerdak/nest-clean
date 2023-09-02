import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository,
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

  public async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  public async create(question: Question): Promise<void> {
    this.items.push(question);

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

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
