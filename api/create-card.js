const { Card, responders } = require('../card');
const { util, log } = require('../helpers');
const {
  messageTypes,
  chatBotAPI,
  callCardStatus,
  cardStatus
} = require('../helpers/enums');
const {
  Responder: { findTelegramUser },
  CallCard: { createCallCard }
} = require('../mongo/methods');
const { setCallStatus } = require('../bot/flows/setCallStatus');
const { Markup } = require('telegraf');

const onSetStatusKeyboardOptions = [
  Markup.callbackButton(
    cardStatus.accepted.name,
    `onSetStatus|${cardStatus.accepted.name}`
  ),
  Markup.callbackButton(
    cardStatus.rejected.name,
    `onSetStatus|${cardStatus.rejected.name}`
  )
];
const onSetStatusKeyboard = Markup.inlineKeyboard(onSetStatusKeyboardOptions);

function generateNewCard(card, chatId) {
  const inlineBtn = `call-location|${chatId}|${card.location['latitude']}|${card.location['longitude']}`;
  const locationButton = Markup.inlineKeyboard([
    Markup.callbackButton('Локація', inlineBtn)
  ]);
  return {
    type: messageTypes.withKeyboard,
    text: card.get(),
    parse_mode: 'Markdown',
    keyboard:
      card.location['latitude'] && card.location['longitude']
        ? locationButton
        : null
  };
}

module.exports = bot =>
  async function(req, res) {
    const {
      ChatBotCall: {
        call_card_id,
        responder_id,
        region,
        caller_number,
        start_datetime,
        patient,
        complain,
        call_address,
        call_comment,
        call_priority
      }
    } = req.body;

    const card = new Card(
      call_card_id,
      responder_id,
      region,
      caller_number,
      start_datetime,
      patient,
      complain,
      call_address,
      call_comment,
      call_priority,
      (status = null)
    );

    let userProfileError;
    const userProfile = await findTelegramUser(responder_id).catch(
      err => (userProfileError = err)
    );

    if (userProfileError && userProfileError.code === 1000) {
      return res.status(400).send({
        message: `Not found chat_id for responderId: ${responder_id}`,
        code: 1000
      });
    } else if (userProfileError && userProfileError.code !== 1000) {
      res.status(500).send({
        message: 'internal server error',
        code: 0,
        err: userProfileError.toString()
      });
    }

    const message = generateNewCard(card, userProfile.chatId);
    let params = chatBotAPI.callStatusUrl(
      responder_id,
      callCardStatus.sent.value,
      call_card_id,
      userProfile.status
    );
    await util.request({ isInternal: true, ...params });

    await bot.telegram
      .sendMessage(userProfile.chatId, message.text, {
        parse_mode: message.parse_mode,
        reply_markup: message.keyboard ? message.keyboard : null
      })
      .then(async () => {
        res.status(200).send({ message: 'done' });
        params = chatBotAPI.callStatusUrl(
          responder_id,
          callCardStatus.delivered.value,
          call_card_id
        );
        return await util.request({ isInternal: true, ...params });
      })
      .catch(err => {
        log.error(
          `[error][event:create-card][method:send-message] ${err.toString()}`
        );
        if (err.description === 'Bad Request: chat not found') {
          return res.status(400).send({
            message: `Not found chatId for responderId: ${responder_id} in DB record`,
            code: 1001
          });
        }
        res.status(500).send({
          message: 'internal server error',
          code: 0,
          err: err.toString()
        });
      });

    card.status = params.body.Responder.call_status;
    // createCallCard(card)
    //   .catch((err) => {
    //     if (err.code == 11000) {
    //       console.debug(`Call card already exists: ${card.callCardId}`);
    //     } else {
    //       console.error('Try to create call card:', err);
    //     }
    //   });

    responders[userProfile.chatId] = card.callCardId;
    await bot.telegram.sendMessage(
      userProfile.chatId,
      'Оберіть, будь ласка, статус виклику',
      { reply_markup: onSetStatusKeyboard }
    );
    // await bot.action(
    //   /^(call-location)/,
    //   async ctx => {
    //     const { } = ctx;
    //     await bot.telegram.sendLocation(userProfile.chatId, card.location['latitude'], card.location['longitude']);
    //     await bot.telegram.answerCbQuery(ctx.callbackQuery.id);
    //   },
    // );

    // await setCallStatus(userProfile, responder_id, call_card_id, bot);
  };
