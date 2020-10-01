const { messageTypes } = require('../../helpers/enums');
const statusCard = require('./setStatusCard');

async function canHandle(text) {
  const result = text == 'Прийнято ✅';
  console.debug('[skill][onStatusResponder] canHandle:', result);
  return result;
}

async function handler({ userChatId }) {
  return {
    toStart: false,
    message: {
      type: 'withKeyboard',
      text: 'Поставили статус',
      keyboard: {
        keyboard: [[{ text: 'ТЕСТ' }]],
      },
    },
    afterSend: [],
  };
}

module.exports = {
  canHandle,
  handler,
};
