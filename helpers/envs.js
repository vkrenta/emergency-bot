/* eslint-disable no-template-curly-in-string */
const { log } = require('./winston-logger');

module.exports = function (path) {
  const options = { debug: false, path };
  const result = require('dotenv').config(options);

  if (result.error) {
    throw result.error;
  } else {
    for (const key in result.parsed) {
      process.env[key] = result.parsed[key];
    }

    const customFields = process.env.customFields.split(' ');
    customFields.forEach(field => {
      if (!process.env[field]) {
        process.env[field] = process.env[`${field}_${process.env.ENV}`];
        log.debug(`[envs][event:set] ${field}:${process.env[field]}`);
      }
    });
    process.env.MONGODB_URI = process.env.MONGODB_URI.replace('{{dbName}}', process.env.DATABASE_NAME);
  }
}
