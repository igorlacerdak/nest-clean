import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students-repository';
import { HashCompare } from '../cryptography/hash-compare';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}