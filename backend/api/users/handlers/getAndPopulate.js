const { User } = require('../model');

const populateChildren = async id =>
  User.findById(id).then(
    user =>
      user.subordinates.length
        ? Promise.all(user.subordinates.map(i => populateChildren(i))).then(subordinates =>
            Object.assign(user, {
              subordinates
            })
          )
        : user
  );

module.exports = populateChildren;
