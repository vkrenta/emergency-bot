/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { log } = require('../helpers');

module.exports.connectToMongo = async function(
  uri = process.env.MONGODB_URI /* eslint-disable no-undef */,
  options = { ssl: true, poolSize: 2, useNewUrlParser: false },
) {
  log.info(`[mongo][connect] db name ${process.env.DATABASE_NAME} mongo url ${uri}`); /* eslint-disable no-undef */
  await mongoose.connect(uri, options);
};
