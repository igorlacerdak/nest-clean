import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository';
import { PrismaAnswersAttachmentRepository } from './prisma/repositories/prisma-answers-attachment-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswersRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersAttachmentRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswersRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersAttachmentRepository,
  ],
})
export class DatabaseModule {}
