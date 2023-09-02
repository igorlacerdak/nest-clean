import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachamentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachamentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}
