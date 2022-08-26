/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('POST CRUD OPERATIONS => /api/post/', () => {
  let token;
  let postId;
  before(async () => {
    const loginInfo = {
      email: 'danial@gmail.com',
      password: 'danial123',
    };
    const response = await request(app).post('/api/auth/login').send(loginInfo);
    token = response.body.token;
  });
  it('(status code: 201) should create post succesfully and return postId of the created post', async () => {
    const response = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        desc: 'Danial first post',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(201);
    expect(body).to.contain.property('postId');
    postId = body.postId;
  });
  it('(status code: 200) should update the post succesfully', async () => {
    const response = await request(app)
      .put(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        desc: 'Danial first updated post',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('postId');
    postId = response.body.postId;
  });
  it('(status code: 500) should should return a CastError', async () => {
    const response = await request(app)
      .put('/api/post/234134')
      .set('Authorization', `Bearer ${token}`)
      .send({
        desc: 'Danial first updated post',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
    expect(body).to.contain('CastError');
  });
  it('(status code: 403) should return a forbidden access error', async () => {
    const response = await request(app)
      .put(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${123}`)
      .send({
        desc: 'Danial first updated post',
      });
    expect(response.statusCode).to.equal(403);
  });
  it('(status code: 200) should return the post which matches the postId', async () => {
    const response = await request(app)
      .get(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('desc');
  });
  it('(status code: 200) should return a message that post succesfully deleted', async () => {
    const response = await request(app)
      .delete(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('Post deleted successfully');
  });
});
