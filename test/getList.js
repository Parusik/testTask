const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  testData = require('./testData');

const { app } = require('../backend/app'),
  { User } = require('../backend/api/users/model'),
  { connect: mongoDBConnect } = require('../backend/tools/db/mongo');

chai.use(chaiHttp);

describe('Return list of users', function() {
  after(done => {
    User.remove({}, err => {
      done();
    });
  });

  before(done => {
    mongoDBConnect().then(() => {
      this.requester = chai.request(app.callback()).keepOpen();
      this.users = Object.values(testData);
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
            const { body: { data: { user } } } = await addUser(userData, getRandomfromArray(signedUsers) || '');
            signedUsers.push(user.id);
          }
          done();
        })();
      });
    });
  });

  it('Administrator access level', done => {
    (async () => {
      const { _id: adminId } = await User.findOne({ role: 2 });

      this.requester.get(`/api/users/${adminId}/getList`).end((err, res) => {
        const { list } = res.body.data;
        expect(list.length).to.be.eql(this.users.length);
        done();
      });
    })();
  });

  it('Boss access level', done => {
    (async () => {
      const { _id: bossId } = await User.findOne({ role: 1 });

      this.requester.get(`/api/users/${bossId}/getList`).end((err, res) => {
        const { list } = res.body.data;
        expect(list.length).to.be.below(this.users.length);
        done();
      });
    })();
  });

  it('User access level', done => {
    (async () => {
      const { _id: userId } = await User.findOne({ role: 0 });

      this.requester.get(`/api/users/${userId}/getList`).end((err, res) => {
        const { list } = res.body.data;
        expect(list.length).to.be.eql(1);
        done();
      });
    })();
  });
});
