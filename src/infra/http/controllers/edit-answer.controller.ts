import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const EditAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
});

type EditAnswerBodySchema = z.infer<typeof EditAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(EditAnswerBodySchema);

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body;
    const { sub: userId } = user;

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
