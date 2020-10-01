const { serverEvent } = require('./enums');
const {log} = require('./winston-logger');

function eventListener(app) {
  app.on(serverEvent.serverOnline, () => {
    log.info(`[eventListener][event:${serverEvent.serverOnline}]`);
  });
  app.on(serverEvent.serviceOnline, () => {
    log.info(`[eventListener][event:${serverEvent.serviceOnline}]`);
  });
  app.on(serverEvent.mongo.connected, () => {
    log.info(`[eventListener][event:${serverEvent.mongo.connected}]`);
  });
  app.on(serverEvent.mongo.error, (err) => {
    log.error(`[error][eventListener][event:${serverEvent.mongo.error}]`, err);
  });
}

module.exports = { eventListener };
