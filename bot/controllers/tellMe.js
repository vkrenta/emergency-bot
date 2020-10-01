const { messageTypes } = require('../../helpers/enums');
const { log } = require('../../helpers');

async function canHandle(text) {
  const result = text == 'tell me my id';
  log.info(`[skill][tell-me] canHandle: ${result}`);
  return result;
}

async function handler({ userChatId }) {
  return {
    toStart: true,
    message: {
      type: messageTypes.simpleMessage,
      text: `Your chatId is ${userChatId}`,
    },
    afterSend: []
  }
}

module.exports = {
  canHandle,
  handler,
};
