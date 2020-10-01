const { BaseScene: Scene } = require('telegraf');
const { responders } = require('../../card');
const {
  util: { request }
} = require('../../helpers');
const {
  Responder: { findResponder }
} = require('../../mongo/methods');
const {
  chatBotAPI,
  cardStatus,
  chooseRigthStatus
} = require('../../helpers/enums');
const { Stage, Markup } = require('telegraf');

const onPlaceKeyboardOptions = [
  Markup.callbackButton(
    cardStatus.arrived.name,
    `onPlace|${cardStatus.arrived.name}`
  )
];
const onPlaceKeyboard = Markup.inlineKeyboard(onPlaceKeyboardOptions);

const onFinishedKeyboardOptions = [
  Markup.callbackButton(
    cardStatus.finished.name,
    `onFinished|${cardStatus.finished.name}`
  )
];
const onFinishedKeyboard = Markup.inlineKeyboard(onFinishedKeyboardOptions);

const stage = new Stage();

// async function setCallStatus(userProfile, responder_id, call_card_id, bot) {
module.exports = bot => {
  // stage.register(onCallStatus);
  // stage.register(onChooseStatus);

  // TODO this part not work correct
  // stage.register(onPlace);
  // stage.register(onFinished);
  ///^(call-accepted)/ && /^(call-accepted)/
  bot.action(/^(onSetStatus)/, async ctx => {
    const {
      callbackQuery: {
        data,
        message: { message_id: messageId }
      }
    } = ctx;
    const [, status] = data.split('|');
    if (status === cardStatus.accepted.name) {
      // TODO refactor this
      ctx.scene.scenes.set('onPlace', onPlace);
      ctx.scene.scenes.set('onFinished', onFinished);

      const {
        from: { id: chatId }
      } = ctx;
      const userProfile = await findResponder(chatId);
      const callCardId = responders[chatId];
      const params = chatBotAPI.callStatusUrl(
        userProfile.responderId,
        cardStatus.accepted.value,
        callCardId
      );
      const result = await request({ ...params, isInternal: true }).catch(err =>
        log.error(`[error][request][Accepted] ${err}`)
      );

      if (result.statusCode === 200) {
        // TODO: In this place ctx.reply don't work...
        // ctx.reply(`Статус виклику був змінений на ${cardStatus.accepted.name}`, onPlaceKeyboard);
        await bot.telegram.editMessageReplyMarkup(chatId, messageId, {
          reply_markup: { remove_keyboard: true }
        });
        await bot.telegram.sendMessage(
          chatId,
          /*`Статус виклику був змінений на "${cardStatus.accepted.name}"`*/
          bot.context.texts
            .getDocument('set_call_status')
            .text.replace('{{status}}', cardStatus.accepted.name),
          { reply_markup: onPlaceKeyboard }
        );
        ctx.scene.enter('onPlace');
      } else {
        ctx.reply(
          ctx.texts.getDocument('set_call_status').options.cant_change,
          Markup.removeKeyboard().extra()
        );
      }
    } else if (status === cardStatus.rejected.name) {
      const {
        from: { id: chatId }
      } = ctx;
      1;
      const userProfile = await findResponder(chatId);
      const callCardId = responders[chatId];
      const params = chatBotAPI.callStatusUrl(
        userProfile.responderId,
        cardStatus.rejected.value,
        callCardId
      );
      const result = await request({ ...params, isInternal: true }).catch(err =>
        log.error(`[error][request][Rejected] ${err}`)
      );

      if (result.statusCode === 200) {
        await bot.telegram.editMessageReplyMarkup(chatId, messageId, {
          reply_markup: { remove_keyboard: true }
        });
        await bot.telegram.sendMessage(
          chatId,
          bot.context.texts.getDocument('set_call_status').options.decline
        );
        // ctx.reply(
        //   result.statusCode === 200 ? 'Ви відхилили виклик' : 'Ми не змогли оновити ваш статус виклику',
        //   Markup.removeKeyboard().extra(),
        // );
      } else {
        ctx.reply(
          bot.context.texts.getDocument('set_call_status').options.cant_change,
          Markup.removeKeyboard().extra()
        );
      }
    } else {
      next();
    }
  });

  // const onCallStatus = new Scene('onCallStatus');
  // const onChooseStatus = new Scene('onChooseStatus');
  const onPlace = new Scene('onPlace');
  const onFinished = new Scene('onFinished');

  bot.action(/^(onPlace)/, async ctx => {
    const {
      callbackQuery: {
        data,
        message: { message_id: messageId }
      }
    } = ctx;
    const [, status] = data.split('|');
    if (status === cardStatus.arrived.name) {
      const {
        from: { id: chatId }
      } = ctx;
      const userProfile = await findResponder(chatId);
      const callCardId = responders[chatId];
      const params = chatBotAPI.callStatusUrl(
        userProfile.responderId,
        cardStatus.arrived.value,
        callCardId
      );
      const result = await request({ ...params, isInternal: true }).catch(err =>
        log.error(`[error][request][onPlace] ${err}`)
      );

      if (result.statusCode === 200) {
        await bot.telegram.editMessageReplyMarkup(chatId, messageId, {
          reply_markup: { remove_keyboard: true }
        });
        ctx.reply(
          /*`Статус виклику був змінений на "${cardStatus.arrived.name}"`*/
          bot.context.texts
            .getDocument('set_call_status')
            .text.replace('{{status}}', cardStatus.arrived.name),
          { reply_markup: onFinishedKeyboard }
        );
        ctx.scene.enter('onFinished');
      } else {
        ctx.reply(
          bot.context.texts.getDocument('set_call_status').options.cant_change,
          Markup.removeKeyboard().extra()
        );
        ctx.scene.leave();
      }
    } else {
      ctx.reply(chooseRigthStatus, { reply_markup: onFinishedKeyboard });
    }
  });

  bot.action(/^(onFinished)/, async ctx => {
    const {
      callbackQuery: {
        data,
        message: { message_id: messageId }
      }
    } = ctx;
    const [, status] = data.split('|');
    if (status === cardStatus.finished.name) {
      const {
        from: { id: chatId }
      } = ctx;
      const userProfile = await findResponder(chatId);
      const callCardId = responders[chatId];
      const params = chatBotAPI.callStatusUrl(
        userProfile.responderId,
        cardStatus.finished.value,
        callCardId
      );
      const result = await request({ ...params, isInternal: true }).catch(err =>
        log.error(`[error][request][onPlace] ${err}`)
      );

      if (result.statusCode === 200) {
        await bot.telegram.editMessageReplyMarkup(chatId, messageId, {
          reply_markup: { remove_keyboard: true }
        });
        ctx.reply(
          /*`Статус виклику був змінений на "${cardStatus.finished.name}"`*/
          bot.context.texts
            .getDocument('set_call_status')
            .text.replace('{{status}}', cardStatus.finished.name)
        );
      } else {
        ctx.reply(
          bot.context.texts.getDocument('set_call_status').options.cant_change,
          Markup.removeKeyboard().extra()
        );
      }
    } else {
      ctx.reply(chooseRigthStatus, { reply_markup: onFinishedKeyboard });
    }
    ctx.scene.leave();
  });

  // TODO this not work
  // bot.use(stage.middleware());

  return true;
};
// onCallStatus.enter(async ctx => {
//   if (ctx.message.text === setCardStatusText) {
//     ctx.reply(setCardStatusText, acceptedKeyboard);
//     ctx.scene.enter('onChooseStatus');
//   } else {
//     ctx.session.isEnd ? ctx.scene.leave() : ctx.reply('Оберіть, будь ласка, статус виклику', acceptedKeyboard);
//   }
// });
// }

// module.exports = { setCallStatus };
