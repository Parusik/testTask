const http = require('http'),
  { app } = require('./app'),
  { server: serverConfigs } = require('./configs'),
  log = require('./tools/logger')(module),
  { connect: mongoDBConnect } = require('./tools/db/mongo'),
  forceExit = require('./tools/system').forceExit(log);

async function init() {
  try {
    await mongoDBConnect();

    const server = http.createServer(app.callback());

    server
      .on('error', forceExit)
      .listen(serverConfigs.PORT, () => log.info(`Server run at port ${serverConfigs.PORT}`));
  } catch (e) {
    forceExit(e);
  }
}

init().catch();
