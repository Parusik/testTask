const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  testData = require('./testData');

const { app } = require('../backend/app'),
  { User } = require('../backend/api/users/model'),
  { connect: mongoDBConnect } = require('../backend/tools/db/mongo');

chai.use(chaiHttp);

describe('Register new user ', function() {
  before(done => {
    mongoDBConnect().then(() => {
      this.requester = chai.request(app.callback()).keepOpen();
      done();
    });
  });
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  it('return success status', done => {
    this.requester
      .post('/api/users')
      .type('form')
      .send(testData.user)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('response should be valid', done => {
    this.requester
      .post('/api/users')
      .type('form')
      .send(testData.user)
      .end(function(err, res) {
        expect(res).to.be.json;
        expect(res.body.status).to.eql('OK');

        const data = res.body.data;
        expect(data.user.boss).to.be.null;
        expect(data.user.subordinates).to.be.empty;
        expect(data.user.role).to.be.eql(0);
        expect(data.user.email).to.be.eql(testData.user.email);
        expect(data.user.username).to.be.eql(testData.user.username);
        done();
      });
  });

  it('should create instance in db', done => {
    this.requester
      .post('/api/users')
      .type('form')
      .send(testData.user)
      .end(function(err, res) {
        const uid = res.body.data.user.id;
        User.findById(uid).then(u => {
          expect(u.boss).to.be.null;
          expect(u.subordinates).to.be.empty;
          expect(u.role).to.be.eql(0);
          expect(u.email).to.be.eql(testData.user.email);
          expect(u.username).to.be.eql(testData.user.username);
        });
        done();
      });
  });
});
