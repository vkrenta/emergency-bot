const { messageTypes } = require('../../helpers/enums');
const statusResponder = require('./setStatusResponder');
const { Responder } = require('../../mongo/methods')

async function canHandle(text) {
  const result = text == '/viewstatus';
  console.debug('[skill][viewstatus] canHandle:', result);
  return result;
}

async function handler({ userChatId }) {
    const responder = await Responder.findResponder(userChatId);
    const responderStatus = responder.status;
    return {
        toStart: false,
        message: {
          type: messageTypes.simpleMessage,
          text: responderStatus,
        },
        afterSend: []
      }
}

module.exports = {
  canHandle,
  handler,
};
