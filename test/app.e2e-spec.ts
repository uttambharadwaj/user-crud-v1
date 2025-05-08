import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User & Teams API (e2e)', () => {
  let app: INestApplication;
  const apiKey = 'dummy-key';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should block requests without API key', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
    it('should allow requests with valid API key', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('x-api-key', apiKey)
        .expect(200);
    });
  });

  describe('Users', () => {
    let userId: number;
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({ name: 'Test User', email: 'test@user.com', role: 'user', isActive: true })
        .expect(201);
      expect(res.body).toHaveProperty('id');
      userId = res.body.id;
    });
    it('should get paginated users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users?page=1&limit=2&sortBy=name&sortOrder=asc')
        .set('x-api-key', apiKey)
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('limit');
    });
    it('should get a user by id', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('x-api-key', apiKey)
        .expect(200);
    });
    it('should update a user', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('x-api-key', apiKey)
        .send({ name: 'Updated User' })
        .expect(200);
    });
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('x-api-key', apiKey)
        .expect(200);
    });
    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/99999')
        .set('x-api-key', apiKey)
        .expect(404);
    });
  });

  describe('Teams', () => {
    let teamId: number;
    let userId: number;
    it('should create a team', async () => {
      const res = await request(app.getHttpServer())
        .post('/teams')
        .set('x-api-key', apiKey)
        .send({ name: 'Test Team', isActive: true })
        .expect(201);
      expect(res.body).toHaveProperty('teamId');
      teamId = res.body.teamId;
    });
    it('should create a user for team membership', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('x-api-key', apiKey)
        .send({ name: 'Team Member', email: 'member@team.com', role: 'user', isActive: true })
        .expect(201);
      userId = res.body.id;
    });
    it('should add a user to the team', async () => {
      await request(app.getHttpServer())
        .post(`/teams/${teamId}/members/${userId}`)
        .set('x-api-key', apiKey)
        .expect(201);
    });
    it('should get paginated teams', async () => {
      const res = await request(app.getHttpServer())
        .get('/teams?page=1&limit=2&sortBy=name&sortOrder=asc')
        .set('x-api-key', apiKey)
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('limit');
    });
    it('should get a team by id', async () => {
      await request(app.getHttpServer())
        .get(`/teams/${teamId}`)
        .set('x-api-key', apiKey)
        .expect(200);
    });
    it('should get team members', async () => {
      const res = await request(app.getHttpServer())
        .get(`/teams/${teamId}/members`)
        .set('x-api-key', apiKey)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
    it('should assign a captain to the team', async () => {
      await request(app.getHttpServer())
        .post(`/teams/${teamId}/captain/${userId}`)
        .set('x-api-key', apiKey)
        .expect(201);
    });
    it('should remove a user from the team', async () => {
      await request(app.getHttpServer())
        .delete(`/teams/${teamId}/members/${userId}`)
        .set('x-api-key', apiKey)
        .expect(200);
    });
    it('should update a team', async () => {
      await request(app.getHttpServer())
        .patch(`/teams/${teamId}`)
        .set('x-api-key', apiKey)
        .send({ description: 'Updated description' })
        .expect(200);
    });
    it('should delete the team', async () => {
      await request(app.getHttpServer())
        .delete(`/teams/${teamId}`)
        .set('x-api-key', apiKey)
        .expect(200);
    });
    it('should return 404 for non-existent team', async () => {
      await request(app.getHttpServer())
        .get('/teams/99999')
        .set('x-api-key', apiKey)
        .expect(404);
    });
  });
});
