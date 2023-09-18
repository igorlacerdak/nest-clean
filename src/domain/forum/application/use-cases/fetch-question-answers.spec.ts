import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Questions Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should to be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('answer-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('answer-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('answer-1') }),
    );

    const result = await sut.execute({
      questionId: 'answer-1',
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('should to be able to fetch paginated question answer', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('answer-1') }),
      );
    }

    const result = await sut.execute({
      questionId: 'answer-1',
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
