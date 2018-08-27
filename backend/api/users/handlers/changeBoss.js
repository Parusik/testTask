const { User } = require('../model'),
  log = require('../../../tools/logger'),
  HTTPError = require('http-custom-errors');

const changeBoss = async (boss, subUserId, newBossId) => {
  const operationData = { boss };
  try {
    operationData.subUser = await User.findById(subUserId);
    operationData.newBoss = await User.findById(newBossId);
  } catch (e) {
    if (!operationData.subUser) {
      throw new HTTPError.InternalServerError(`Can't get user data by id "${subUserId}" `);
    }

    if (!operationData.newBoss) {
      throw new HTTPError.InternalServerError(`Can't get new boss data by id "${newBossId}" `);
    }
  }

  if (operationData.newBoss.level > operationData.subUser.level) {
    const checkParents = async node =>
      node._id.toString() === subUserId.toString()
        ? true
        : node.boss ? checkParents(await User.findById(node.boss)) : false;

    if (await checkParents(operationData.newBoss)) {
      throw new HTTPError.InternalServerError(`Can't change boss data because of circular dependency `);
    }
  }

  try {
    operationData.boss.subordinates.pull({ _id: operationData.subUser._id });

    operationData.newBoss.pushSubordinator(operationData.subUser);
    await operationData.boss.save();
    await operationData.newBoss.save();
    await operationData.subUser.save();
  } catch (e) {
    log.error(e);
  }
};
module.exports = changeBoss;
