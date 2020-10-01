const uuidv1 = require('uuid/v1');
const urlRegex = require('url-regex');
const r = require('request');
const { log } = require('./winston-logger');

function request({
  uri,
  method = 'POST',
  json = true,
  body,
  headers = {},
  qs = {},
  isInternal = false,
}) {
  const requestId = uuidv1();

  const options = {
    uri,
    method,
    json,
    body,
    headers,
    qs,
    isInternal,
  };
  if (isInternal) {
    options.body.secret = process.env.secret;
  }
  if (!urlRegex().test(options.uri)) {
    const err = new Error('Invalid value');
    err.code = 1;
    err.data = { uri: options.uri };
    throw err;
  }

  if (process.env.useRequestLoggerOutbound == 'true') {
    log.info(`[request:${requestId}] ${JSON.stringify(options)}`);
  }
  log.info(`request.uri ${options.uri}`);

  return new Promise((resolve, reject) => r(options, (err, res) => {
    if (process.env.useRequestLoggerOutbound == 'true') {
      log.info(`[response:${requestId}] ${JSON.stringify({ err, statusCode: res ? res.statusCode : null, body })}`);
    }
    if (err) {
      reject(err);
    } else {
      res.requestId = requestId;
      resolve(res);
    }
  }));
}



module.exports = { request };
