const { User } = require('../model');
const mongoose = require('mongoose');

const findAdmin = () => User.findOne({ role: 2 });
const findBoss = async bossId => {
  if (bossId) {
    try {
      return await User.findById(bossId);
    } catch (e) {
      return findAdmin();
    }
  } else {
    return findAdmin();
  }
};

module.exports = async (data, bossId) => {
  const belongToUser = await findBoss(bossId),
    newUser = new User(data);

  if (belongToUser) {
    belongToUser.pushSubordinator(newUser);
    await belongToUser.save();
  } else {
    newUser.becomeAdmin();
  }
  return newUser.save();
};
