const { util, PromiseProgress } = require('../../helpers');
const { callbackQueryType, messageTypes, cardStatus, responderStatus, chatBotAPI } = require('../../helpers/enums');
const { log } = require('../../helpers');
// const { action: statusResponderAction } = require('./setStatusResponder');

module.exports = {
  action: {
    [callbackQueryType.status.card.choose]: ({ userProfile, value }) => {
      return new PromiseProgress(async (resolve, reject, progress) => {
        const { chatId, responderId, status } = userProfile;
        const [cardChoosedStatus, cardId] = value;
        const cardChoosedName = cardStatus[cardChoosedStatus.toLowerCase()].name;

        // if (cardStatus.accepted.value == cardChoosedStatus) {
        //   // const result = await util.request({
        //   //   isInternal: true,
        //   //   method: 'POST',
        //   //   body: {
        //   //     userChatId: chatId,
        //   //     Responder: {
        //   //       status: responderStatus.busy
        //   //     }
        //   //   }
        //   // });
        //   // const msg = await statusResponderAction[callbackQueryType.status.responder.choose]({ userProfile, value: [responderStatus.busy] });
        //   // progress(msg.message);
        // }
        const params = chatBotAPI.callStatusUrl(responderId, cardChoosedStatus, cardId, status);
        const result = await util.request({ ...params, isInternal: true })
          .catch(err => log.error(`[error][request][respondersStatusUrl] ${err}`));
        resolve({
          toStart: false,
          message: {
            type: messageTypes.simpleMessage,
            chat_id: chatId,
            text: result.statusCode == 200 ? `Статус виклику був змінений на ${cardChoosedName}` : 'Ми не змогли оновити ваш статус виклику'
          }
        });
      })
    }
  }
}