const { log } = require('../index');

function secretValidation(req, res, next) {
  const { secret } = req.body;
  const result = secret != process.env.secret;
  log.info(`[request::${req.requestId}][middleware:secretValidation] result:${!result}`);
  if (result) {
    return res.status(400).send({ message: 'Wrong secret in body' });
  }
  next();
}
module.exports = { secretValidation }