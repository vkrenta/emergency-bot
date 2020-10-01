/* eslint-disable no-undef */
const uuid = require('uuid/v1');
const { log } = require('../index');
function safeJSONParse(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return undefined;
  }
}

function bodyToString(body, isJSON) {
  const stringBody = body && body.toString();
  return isJSON ? safeJSONParse(body) || stringBody : stringBody;
}

function logger(req, res, next) {
  if (process.env.useRequestLoggerInbound != 'true') {
    return next();
  }
  const requestId = uuid();
  const pack = {
    headers: req.headers,
    method: req.method,
    body: req.body,
    originalUrl: req.originalUrl,
    params: req.params,
    query: req.query,
  };
  log.info(`[received request:${requestId}] ${JSON.stringify(pack)}`);
  req.requestId = requestId;
  // eslint-disable-next-line prefer-destructuring
  const end = res.end;
  res.end = function(chunk, encoding) {
    res.end = end;
    res.end(chunk, encoding);
    const isJson = res._headers && res._headers['content-type'] && res._headers['content-type'].indexOf('json') >= 0;

    const body = bodyToString(chunk, isJson);
    log.info(`[received response:${requestId}] ${JSON.stringify(body, null, '  ')}`);
  };
  return next();
}
module.exports = { logger };
