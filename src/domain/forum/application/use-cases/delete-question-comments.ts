import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  public async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right(null);
  }
}