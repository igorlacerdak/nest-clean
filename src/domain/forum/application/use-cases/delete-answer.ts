import { Either, left, right } from '@/core/either';
import { AnswerRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private AnswersRepository: AnswerRepository) {}

  public async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const Answer = await this.AnswersRepository.findById(answerId);

    if (!Answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== Answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.AnswersRepository.delete(Answer);

    return right(null);
  }
}
