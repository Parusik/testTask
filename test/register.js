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

  it('first user in DB become an admin', done => {
    this.requester
      .post('/api/users')
      .type('form')
      .send(testData.user)
      .end(function(err, res) {
        const newUser = res.body.data.user;
        expect(newUser.role).to.be.eql(2);
        expect(newUser.level).to.be.eql(0);
        expect(newUser.boss).to.be.null;
        expect(newUser.subordinates).to.be.empty;
        done();
      });
  });

  it('users without specified boss are belong to admin', done => {
    (async () => {
      const { _id: adminId } = await new User(testData.admin).save();

      this.requester
        .post('/api/users')
        .type('form')
        .send(testData.user)
        .end(function(err, res) {
          User.findById(adminId).then(adminUpdated => {
            const newUser = res.body.data.user;

            expect(adminUpdated.subordinates).to.include(newUser.id);
            expect(adminUpdated.role).to.be.eql(2);

            expect(newUser.boss).to.be.eql(adminUpdated.id);
            done();
          });
        });
    })();
  });

  it('users with invalid specified boss are belong to admin', done => {
    (async () => {
      const { _id: adminId } = await new User(testData.admin).save();

      this.requester
        .post('/api/users')
        .type('form')
        .query({ boss: 'test' })
        .send(testData.user)
        .end(function(err, res) {
          User.findById(adminId).then(adminUpdated => {
            const newUser = res.body.data.user;

            expect(adminUpdated.subordinates).to.include(newUser.id);
            expect(adminUpdated.role).to.be.eql(2);

            expect(newUser.boss).to.be.eql(adminUpdated.id);
            done();
          });
        });
    })();
  });

  it('users with specified boss are belong to boss', done => {
    const that = this;

    this.requester
      .post('/api/users')
      .type('form')
      .send(testData.admin)
      .end((err, res) => {
        const admin = res.body.data.user;

        this.requester
          .post('/api/users')
          .type('form')
          .send(testData.user1)
          .end((err, res) => {
            const boss = res.body.data.user;

            this.requester
              .post('/api/users')
              .type('form')
              .query({ boss: boss.id })
              .send(testData.user)
              .end((err, res) => {
                const user = res.body.data.user;

                User.findById(boss.id).then(updatedBoss => {
                  expect(updatedBoss.subordinates).to.include(user.id);

                  expect(updatedBoss.role).to.be.eql(1);
                  expect(user.role).to.be.eql(0);

                  expect(user.boss).to.be.eql(updatedBoss.id);
                  done();
                });
              });
          });
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
          expect(u.role).to.be.eql(2);
          expect(u.email).to.be.eql(testData.user.email);
          expect(u.username).to.be.eql(testData.user.username);
          done();
        });
      });
  });
});
