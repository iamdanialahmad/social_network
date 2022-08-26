/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('USER CRUD Operations, Moderation Feed and Payment => /api/user', () => {
  let token;
  let userId2;
  before(async () => {
    const loginInfo = {
      email: 'danial@gmail.com',
      password: 'danial123',
    };
    const response = await request(app).post('/api/auth/login').send(loginInfo);
    token = response.body.token;
    const signup2 = {
      username: 'Wajahat_312',
      email: 'wajahat@gmail.com',
      password: 'wajahat312',
      fullname: 'Wajahat Ahmad',

    };
    const response2 = await request(app).post('/api/auth/signup').send(signup2);
    userId2 = response2.body.userId;
  });
  it('(status code: 200) should return user', async () => {
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('username');
    expect(body).to.contain.property('fullname');
    expect(body).to.contain.property('followers');
    expect(body).to.contain.property('following');
    expect(body).to.contain.property('isPaid');
    expect(body).to.contain.property('isModerator');
    expect(body).to.contain.property('email');
  });
  it('(status code: 200) should return the updated user', async () => {
    const response = await request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        isModerator: true,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('updatedUser');
    expect(body).to.contain.property('message').contain('Account has been updated');
  });
  it('(status code: 200) should return all the posts', async () => {
    const response = await request(app)
      .get('/api/user/postModeration/feed')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('posts');
    expect(body).to.contain.property('totalPages');
    expect(body).to.contain.property('CurrentPage');
  });
  it('(status code: 200) should return the updated user', async () => {
    const response = await request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        isModerator: false,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('updatedUser');
    expect(body).to.contain.property('message').contain('Account has been updated');
  });
  it('(status code: 403) should return a forbidden access error as the user is not a moderator', async () => {
    const response = await request(app)
      .get('/api/user/postModeration/feed')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(403);
    expect(body).to.contain('You are not a moderator');
  });
  it('(status code: 200) should return a message that user followed successfully', async () => {
    const response = await request(app)
      .put('/api/user/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({
        followUserId: `${userId2}`,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('User followed');
  });
  it('(status code: 403) should return a error message that you already follow this user', async () => {
    const response = await request(app)
      .put('/api/user/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({
        followUserId: `${userId2}`,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(403);
    expect(body).to.contain('You already follow this user');
  });

  it('(status code: 200) should return a message that user unfollowed successfully', async () => {
    const response = await request(app)
      .put('/api/user/unfollow')
      .set('Authorization', `Bearer ${token}`)
      .send({
        unfollowUserId: `${userId2}`,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('User unfollowed');
  });

  it('(status code: 403) should return a error message that you donot followed the user', async () => {
    const response = await request(app)
      .put('/api/user/unfollow')
      .set('Authorization', `Bearer ${token}`)
      .send({
        unfollowUserId: `${userId2}`,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(403);
    expect(body).to.contain("You don't follow this user");
  });

  it('(status code: 200) should return a message that payment is successfull', async () => {
    const response = await request(app)
      .post('/api/user/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: '4242424242424242',
        exp_month: '8',
        exp_year: '2023',
        cvc: '314',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('Payment Succesfull');
  });

  it('(status code: 500) should return a StripeCardError', async () => {
    const response = await request(app)
      .post('/api/user/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: '424424242424242',
        exp_month: '8',
        exp_year: '203',
        cvc: '314',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
    expect(body).to.contain('Error');
  });
  it('(status code: 200) should return message that user deleted successfully', async () => {
    const response = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('Account has been deleted');
  });
});
