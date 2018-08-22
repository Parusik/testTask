module.exports.forceExit = log => err => {
  log.error(err);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
};
