import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository,
    );
  });

  it('should to be able to choose question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      answerId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it('should not be able to chose another user questio best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    const answer = makeAnswer({
      answerId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
