import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const EditQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof EditQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(EditQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private EditQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { content, title } = body;
    const { sub: userId } = user;

    await this.EditQuestion.execute({
      questionId,
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });
  }
}
