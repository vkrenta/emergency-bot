const assert = require('assert');
const { util: { request } } = require('../helpers');

async function setWebhook({ token, url }) {
  assert(token != null);
  assert(url != null)
  const uri = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;
  const result = await request({ uri, method: 'GET' });
  if (result.statusCode != 200) {
    const err = new Error(`Can not setWebhook for telegram bot with token: ${token}`);
    err.name = 'TelegramBot.setWebhook';
    throw err;
  }
}

async function verification(token) {
  assert(token != null);
  const uri = `https://api.telegram.org/bot${token}/getMe`;
  const result = await request({ uri, method: 'GET' });
  if (result.statusCode != 200) {
    logger.warn(`Can not verify bot with token: ${token}`);
    return null;
  }
  return result.body;
}

async function checkWebhook(token) {
  assert(token != null);
  const uri = `https://api.telegram.org/bot${token}/getWebhookInfo`;
  const result = await request({ uri, method: 'GET' });
  if (result.statusCode != 200) {
    logger.warn(`Can not check webhook info for bot with token: ${token}`);
    return null;
  }
  return result.body;
}

module.exports = { setWebhook, checkWebhook, verification }