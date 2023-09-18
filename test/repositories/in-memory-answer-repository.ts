import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  public async create(answer: Answer): Promise<void> {
    this.items.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  public async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  public async findManyByAnswerId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  public async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }

  public async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
