import { DomainEvents } from '@/core/events/domain-events';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  public async findByEmail(email: string): Promise<Student | null> {
    const question = this.items.find((item) => item.email === email);

    if (!question) {
      return null;
    }

    return question;
  }

  public async create(student: Student): Promise<void> {
    this.items.push(student);

    DomainEvents.dispatchEventsForAggregate(student.id);
  }
}
