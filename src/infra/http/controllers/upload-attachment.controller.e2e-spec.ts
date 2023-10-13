import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-students';

import { join } from 'path';

describe('Upload attachment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);

    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const access_token = jwt.sign({ sub: user.id.toString() });

    const image = join(__dirname, '../../../../test/e2e', 'nodejs.png');

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${access_token}`)
      .attach('file', image);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
