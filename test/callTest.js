const { messageTypes, cardStatus } = require("../helpers/enums");
const { log } = require("../helpers");

async function canHandle(text) {
  const result = text == "call invoked";
  log.info(`[skill][call-invoked] canHandle: ${result}`);
  return result;
}

async function handler({ userChatId }) {
  return {
    toStart: true,
    message: {
      type: messageTypes.withKeyboard,
      text: "test call",
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: cardStatus.accepted.name,
              callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.ready}`
            },
            {
              text: responderStatus.busy,
              callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.busy}`
            }
          ],
          [
            {
              text: responderStatus.ready,
              callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.ready}`
            },
            {
              text: responderStatus.busy,
              callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.busy}`
            }
          ]
        ]
      })
    },
    afterSend: []
  };
}

module.exports = {
  canHandle,
  handler
};
