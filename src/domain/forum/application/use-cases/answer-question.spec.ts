import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
  });

  it('should to be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteudo da resposta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Conteudo da pergunta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    );
  });
});
