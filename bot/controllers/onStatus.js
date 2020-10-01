const { messageTypes } = require('../../helpers/enums');
const statusResponder = require('./setStatusResponder');

async function canHandle(text) {
  const result = text == '/setstatus';
  console.debug('[skill][onStatus] canHandle:', result);
  return result;
}

async function handler({ userChatId }) {
  return {
    toStart: false,
    message: statusResponder.generateChooseStatus(),
    afterSend: []
  }
}

module.exports = {
  canHandle,
  handler,
};
