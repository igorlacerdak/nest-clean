import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should to be able to comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentário teste',
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    );
  });
});
