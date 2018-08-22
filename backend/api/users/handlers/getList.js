const { User } = require('../model');

const getRecursiveList = async id => {
  const list = [];

  const getUser = async uid => {
    const user = await User.findById(uid);
    if (user) {
      list.push(user);
      if (user.subordinates.length) {
        for (let sid of user.subordinates) {
          await getUser(sid);
        }
      }
    }
  };

  // if (user.role === 2){
  //   console.log('admin');
  // }

  await getUser(id);
  return list;
};
module.exports = getRecursiveList;
