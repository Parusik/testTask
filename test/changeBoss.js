const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  testData = require('./testData');

const { app } = require('../backend/app'),
  { User } = require('../backend/api/users/model'),
  { connect: mongoDBConnect } = require('../backend/tools/db/mongo');

chai.use(chaiHttp);

describe('Change boss', function() {
  after(done => {
    // User.remove({}, err => {
    done();
    // });
  });

  before(done => {
    mongoDBConnect().then(() => {
      this.requester = chai.request(app.callback()).keepOpen();
      this.users = Object.values(testData);
      this.credentials = {};

      User.remove({}, err => {
        const addUser = (userData, boss) =>
          this.requester
            .post('/api/users')
            .query({ boss })
            .send(userData);

        const getRandomfromArray = arr => arr[Math.round(Math.random() * arr.length)];

        (async () => {
          const signedUsers = [];
          for (let userData of this.users) {
            this.credentials[userData.email] = userData.password;
            const { body: { data: { user } } } = await addUser(userData, getRandomfromArray(signedUsers) || '');
            signedUsers.push(user.id);
          }
          done();
        })();
      });
    });
  });

  it('should not change boss without auth', done => {
    (async () => {
      this.requester
        .put(`/api/users/${'test'}/changeBoss`)
        .query({ subUserId: 'test', newBossId: 'test' })
        .end((err, res) => {
          expect(res.body.data).to.be.null;
          expect(res.body.status).to.be.eql('Unauthorized');
          expect(res.body.msg).to.be.eql('Authentication Error');
          done();
        });
    })();
  });

  it('should change boss with auth', done => {
    (async () => {
      const { _id: adminId, subordinates: beforeUpadateSubordinates } = await User.findOne({ role: 2 });
      const { email: bossEmail, _id: bossId } = await User.findOne({ role: 1 });

      const { body: { data: { at: token, user: { subordinates: { 0: subUserId } } } } } = await this.requester
        .post('/auth')
        .type('form')
        .send({ email: bossEmail, password: this.credentials[bossEmail] });

      this.requester
        .put(`/api/users/${bossId}/changeBoss`)
        .set('Authorization', token)
        .query({ subUserId: subUserId.toString(), newBossId: adminId.toString() })
        .end((err, res) => {
          (async () => {
            const subUser = await User.findById(subUserId),
              newBoss = await User.findById(adminId),
              boss = await User.findById(bossId);

            expect(subUser.boss).to.be.eql(newBoss._id);
            expect(subUser.level).to.be.eql(newBoss.level + 1);
            expect(newBoss.subordinates).to.include(subUser.id);
            expect(newBoss.subordinates.length).to.be.eql(beforeUpadateSubordinates.length + 1);

            expect(boss.subordinates).to.not.include(subUser.id);
            done();
          })();
        });
    })();
  });

  it('should protect changing boss with circular dependencies', done => {
    (async () => {
      const { _id: subUserId, boss: bossId, subordinates } = await User.findOne({
        role: 1
      });
      const { email: bossEmail } = await User.findById(bossId);

      const { body: { data: { at: token } } } = await this.requester
        .post('/auth')
        .type('form')
        .send({ email: bossEmail, password: this.credentials[bossEmail] });

      const query = {
        newBossId: JSON.parse(JSON.stringify(subordinates))[0],
        subUserId: subUserId.toString()
      };

      this.requester
        .put(`/api/users/${bossId}/changeBoss`)
        .set('Authorization', token)
        .query(query)
        .end((err, res) => {
          (async () => {
            expect(res.status).to.be.eql(500);
            done();
          })();
        });
    })();
  });
});
