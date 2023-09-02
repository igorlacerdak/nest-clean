import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface QuesitonAttachmentProps {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuesitonAttachmentProps> {
  get questionId() {
    return this.props.questionId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: QuesitonAttachmentProps, id?: UniqueEntityID) {
    const attachment = new QuestionAttachment(props, id);

    return attachment;
  }
}
