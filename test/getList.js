const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  testData = require('./testData');

const { app } = require('../backend/app'),
  { User } = require('../backend/api/users/model'),
  { connect: mongoDBConnect } = require('../backend/tools/db/mongo');

chai.use(chaiHttp);

describe('Return list of users', function() {
  before(done => {
    mongoDBConnect().then(() => {
      this.requester = chai.request(app.callback()).keepOpen();

      const users = Object.values(testData).map(userData => new User(userData));
      const admin = users[0],
        u1 = users[1],
        u2 = users[2],
        u3 = users[3],
        u4 = users[4],
        u5 = users[5];

      admin.role = 2;
      admin.subordinates.push(u1._id);
      this.admin = admin;

      u1.boss = admin._id;
      u1.role = 1;
      u1.subordinates.push(u2._id, u3._id);
      this.boss = u1;

      u2.boss = u1._id;
      u2.role = 1;

      u3.boss = u1._id;
      u3.role = 1;
      u3.subordinates.push(u5._id, u4._id);

      u5.boss = u3._id;
      u4.boss = u3._id;
      this.slave = u5;

      User.remove({}, err => {
        Promise.all(users.map(u => u.save())).then(() => {
          done();
        });
      });
    });
  });
  it('Administrator access level', done => {
    this.requester.get(`/api/users/${this.admin._id}/getList`).end(function(err, res) {
      const { list } = res.body.data;
      expect(list).to.be.array;
      done();
    });

    done();
  });

  it('Boss access level', done => {
    done();
  });

  it('User access level', done => {
    done();
  });
});
