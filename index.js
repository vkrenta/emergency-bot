/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');

const { setEnv, eventListener } = require('./helpers');
setEnv(process.env.envPath);

const { connectToMongo } = require('./mongo');
const { logger } = require('./helpers/middleware');
const { serverEvent } = require('./helpers/enums');
const { log } = require('./helpers');
const { setup } = require('./bot');
const APIRouter = require('./api');


process.on('uncaughtException', err => {
  log.info(`[uncaughtException] ${JSON.stringify(err)}`, err);
  process.exit(0);
});

const app = express();
app.use(logger);
eventListener(app);

app.listen(process.env.port, async () => app.emit(serverEvent.serverOnline));
connectToMongo()
  .then(() => {
    app.emit(serverEvent.mongo.connected);
    return setup(app);
  })
  .then(bot => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(APIRouter(bot));
    app.emit(serverEvent.serviceOnline);
  })
  .catch(err => {
    log.error(`${err.toString()}`);
  });

module.exports = app;
