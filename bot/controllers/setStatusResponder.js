module.exports = bot => {
  const { Markup } = require('telegraf');
  const {
    Responder: { findResponder }
  } = require('../../mongo/methods');
  const statusKeyboard = Markup.keyboard([['Ready'], ['Busy'], ['Offduty']])
    .oneTime()
    .resize()
    .extra();

  bot.command('status', async ctx => {
    const userProfile = await findResponder(ctx.message.from.id);
    if (!userProfile) return ctx.reply('Ви не зареєстрований респондер');
    ctx.session = { userProfile };
    ctx.reply('Оберіть ваш статус:', statusKeyboard);
    await ctx.scene.enter('setResponderStatus');
  });
};

/*
const { util, PromiseProgress } = require('../../helpers');
const { Responder: { setStatus } } = require('../../mongo/methods');
const { callbackQueryType, messageTypes, responderStatus, chatBotAPI } = require('../../helpers/enums');
const { log } = require('../../helpers');



function generateChooseStatus() {
  return {
    type: messageTypes.withKeyboard,
    text: 'Оберіть ваш статус',
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: responderStatus.ready, callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.ready}` },
        { text: responderStatus.busy, callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.busy}` },
        { text: responderStatus.offduty, callback_data: `${callbackQueryType.status.responder.choose}_${responderStatus.offduty}` }
      ]]
    })
  }
}

module.exports = {
  action: {
    [callbackQueryType.status.responder.set]: () => new PromiseProgress(async (resolve) =>
      resolve({
        toStart: false,
        message: generateChooseStatus()
      })
    ),
    [callbackQueryType.status.responder.choose]: ({ userProfile, value }) =>
      new PromiseProgress(async (resolve) => {
        const { chatId, responderId } = userProfile;
        const [status] = value;
        const params = chatBotAPI.respondersStatusUrl(responderId, status);
        const result = await util.request({ isInternal: true, ...params })
          .catch(err => log.error(`[error][request][respondersStatusUrl] ${err} `));
        setStatus(chatId, status);
        resolve({
          toStart: false,
          message: {
            type: messageTypes.simpleMessage,
            chat_id: chatId,
            text: result.statusCode == 200 ? `Ваш статус був змінений на ${status}` : 'Ми не змогли оновити ваш статус'
          }
        });
      })
  },
  generateChooseStatus
}*/
