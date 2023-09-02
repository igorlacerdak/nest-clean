import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  public async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { email } });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  public async create(student: Student): Promise<void> {
    const data = await PrismaStudentMapper.toPrisma(student);

    await this.prisma.user.create({
      data,
    });
  }
}
