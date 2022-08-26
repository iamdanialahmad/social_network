/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('User register => /api/auth/signup', () => {
  it('(status code: 201) should return a object with the userId of the created user', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      username: 'danial123',
      email: 'danial@gmail.com',
      password: 'danial123',
      fullname: 'danial123',
    });
    const { body } = response;
    expect(body).to.contain.property('userId');
    expect(response.statusCode).to.equal(201);
  });
  it('(status code: 400) should return bad request error when signing up with unavailable credentials)', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      username: 'danial123',
      email: 'danial@gmail.com',
      password: 'danial123',
      fullname: 'danial123',
    });
    const { body } = response;
    expect(body).to.contain('Credentials not available');
    expect(response.statusCode).to.equal(400);
  });

  it('(status code: 403) should return validation error', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      username: 'test123',
    });
    expect(response.statusCode).to.equal(500);
  });
});

describe('User login => /api/auth/login', () => {
  it('(status code: 200) should return jwt token and userId', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'danial@gmail.com',
      password: 'danial123',
    });
    const { body } = response;
    expect(body).to.contain.property('userId');
    expect(body).to.contain.property('token');
    expect(response.statusCode).to.equal(200);
  });
  it('(status code: 400) should return bad request error when logging in with wrong credentials)', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'test123',
    });
    const { body } = response;
    expect(body).to.contain('Wrong credentials');
    expect(response.statusCode).to.equal(403);
  });
  it('(status code: 201) should return a object with the userId of the created user', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      username: 'areeb123',
      email: 'areeb@gmail.com',
      password: 'areeb123',
      fullname: 'areeb123',
    });
    const { body } = response;
    expect(body).to.contain.property('userId');
    expect(response.statusCode).to.equal(201);
  });
});
