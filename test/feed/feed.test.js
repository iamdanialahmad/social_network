/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('User Feed => /api/feed', () => {
  let token;
  let token2;
  before(async () => {
    const loginInfo = {
      email: 'danial@gmail.com',
      password: 'danial123',
    };
    const loginInfo2 = {
      email: 'areeb@gmail.com',
      password: 'areeb123',
    };
    const response = await request(app).post('/api/auth/login').send(loginInfo);
    token = response.body.token;

    const response2 = await request(app).post('/api/auth/login').send(loginInfo2);
    token2 = response2.body.token;

    await request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ isPaid: true });
  });
  it('(status code: 403) should return a error message that the user is not a premium member', async () => {
    const response = await request(app)
      .get('/api/feed')
      .set('Authorization', `Bearer ${token2}`)
      .send();
    expect(response.statusCode).to.equal(403);
  });
  it('(status code: 200) should return all the array of post', async () => {
    const response = await request(app)
      .get('/api/feed')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('posts');
  });
});
