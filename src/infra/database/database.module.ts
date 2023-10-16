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
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
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
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    { provide: AnswerRepository, useClass: PrismaAnswersRepository },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswersCommentsRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswersAttachmentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentsRepository,
    AnswerAttachmentRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
