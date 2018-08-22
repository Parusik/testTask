const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  testData = require('./testData');

const { app } = require('../backend/app'),
  { User } = require('../backend/api/users/model'),
  { connect: mongoDBConnect } = require('../backend/tools/db/mongo');

chai.use(chaiHttp);


describe('Auth ', function() {
  before(done => {
    mongoDBConnect().then(() => {
      this.requester = chai.request(app.callback()).keepOpen();
      done();
    });
  });
  beforeEach(done => {
    User.remove({}, err => {
      const a = new User(testData.user);
      a.save(() => {
        done();
      });
    });
  });

  it('Email + password: auth', done => {
    const email = testData.user.email,
      password = testData.user.password;

    this.requester
      .post('/auth')
      .type('form')
      .send({ email, password })
      .end(function(err, res) {
        const user = res.body.data.user;
        expect(user.boss).to.be.null;
        expect(user.subordinates).to.be.empty;
        expect(user.role).to.be.eql(0);
        expect(user.email).to.be.eql(testData.user.email);
        expect(user.username).to.be.eql(testData.user.username);

        const token = res.body.data.at;
        expect(token).to.be.a('string');
        expect(token.startsWith('Bearer')).to.be.true;
        done();
      });
  });

  it('JWT: auth', done => {
    const email = testData.user.email,
      password = testData.user.password;

    this.requester
      .post('/auth')
      .type('form')
      .send({ email, password })
      .end((err, res) => {

        const token = res.body.data.at;

        this.requester
          .get('/auth')
          .type('form')
          .set('Authorization', token)
          .end(function(err, res) {
            const user = res.body.data.user;
            expect(user.boss).to.be.null;
            expect(user.subordinates).to.be.empty;
            expect(user.role).to.be.eql(0);
            expect(user.email).to.be.eql(testData.user.email);
            expect(user.username).to.be.eql(testData.user.username);
            done();
          });
      });


  });
});
