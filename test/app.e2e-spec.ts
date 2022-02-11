import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configure } from '@/main';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UserRepository } from '@/entity/user';
import { Response } from 'express';

process.env.TZ = 'UTC';

const now: Date = new Date();

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepo: UserRepository;

  beforeAll(async () => {
    if (app) app.close();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configure(app);

    await app.init();

    userRepo = app.get('UserRepository');
  });

  it('GET user reward BY no params', () => {
    return request(app.getHttpServer()).get(`/users/1/rewards?at=`).expect(400);
  });

  it('GET user reward BY invalid params (1)', () => {
    return request(app.getHttpServer()).get(`/users/1/rewards?at=string`).expect(400);
  });

  it('GET user reward BY invalid params (2)', () => {
    return request(app.getHttpServer()).get(`/users/1/rewards?at=123`).expect(400);
  });

  it('GET user reward BY invalid params (3)', () => {
    return request(app.getHttpServer()).get(`/users/1/rewards?at=${now.toString()}`).expect(400);
  });

  it('GET user reward', () => {
    return request(app.getHttpServer())
      .get(`/users/1/rewards?at=2020-03-15T00:00:00Z`)
      .expect(200)
      .then((res: any) => {
        expect(res.body.data.length).toBe(7);
      });
  });

  it('PATCH user reward BY expired date (1)', () => {
    return request(app.getHttpServer()).patch(`/users/1/rewards/2020-03-15T00:00:00Z/redeem`).expect(409);
  });

  it('GET user reward', () => {
    return request(app.getHttpServer())
      .get(`/users/1/rewards?at=${now.toISOString()}`)
      .expect(200)
      .then((res) => expect(res.body.data.length).toBe(7));
  });

  it('PATCH user reward', () => {
    return request(app.getHttpServer()).patch(`/users/1/rewards/${now.toISOString()}/redeem`).expect(200);
  });

  it('PATCH user reward BY non existend user', () => {
    return request(app.getHttpServer()).patch(`/users/193752/rewards/${now.toISOString()}/redeem`).expect(409);
  });

  it('PATCH user reward BY future date', () => {
    const futureDate: Date = new Date(now.getTime() + 86400000 * 14);

    return request(app.getHttpServer()).patch(`/users/1/rewards/${futureDate.toISOString()}/redeem`).expect(409);
  });
});
