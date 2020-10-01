const { util, PromiseProgress } = require('../../helpers');
const { callbackQueryType, messageTypes, cardStatus, responderStatus } = require('../../helpers/enums');

module.exports = {
  action: {
    [callbackQueryType.status.card.showOnMap]: ({ userChatId, value }) => {
      return new PromiseProgress(async (resolve, reject, progress) => {
        const [latitude, longitude] = value[0].split('|');
        resolve({
          toStart: false,
          message: {
            latitude,
            longitude,
            type: messageTypes.location,
            chat_id: userChatId,
          }
        });
      })
    }
  }
}