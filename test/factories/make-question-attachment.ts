import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  QuestionAttachment,
  QuesitonAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(
  override: Partial<QuesitonAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return questionAttachment;
}
