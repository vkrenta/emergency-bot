const Telegraf = require('telegraf');
const controllers = require('../bot/controllers');
const {
  util: { request },
} = require('../helpers');
const {
  Responder: { findResponder },
} = require('../mongo/methods');
const { log } = require('../helpers');
const { messageTypes, telegramMessageTypes, telegramMessageHandlers, callbackQueryType } = require('../helpers/enums');

class TelegrafBot {
  static detectMessageType(body) {
    for (const type in telegramMessageTypes) if (type in body) return telegramMessageTypes[type];
    return null;
  }

  constructor(token) {
    this.token = token;
    this.api = new Telegraf({ token: this.token });    
    this.controllers = controllers;
    this.telegram = this.api.telegram;
  }

  async sendMessage(userChatId, pack) {
    if (!pack) {
      return null;
    }
    const { type } = pack;
    switch (type) {
      case messageTypes.withKeyboard: {
        return this.telegram.sendMessage(userChatId, pack.text);
      }
      case messageTypes.simpleMessage: {
        return await this.telegram.sendMessage(userChatId, pack);
      }
      case messageTypes.location: {
        await this.api.sendLocation({ ...pack, chat_id: userChatId });
        break;
      }
      default: {
        log.error(`[bot][method:sendMessage] Undefined type: ${type}`);
        break;
      }
    }
  }

  async haveMessage(body) {
    const telegramType = TelegramBot.detectMessageType(body);
    if (!telegramType) {
      log.error(`[error][method:haveMessage] Can not detect message type from telegram ${JSON.stringify(body)}`);
      return;
    }
    const telegramHandler = telegramMessageHandlers[telegramType];
    switch (telegramType) {
      case telegramMessageTypes.message: {
        this.onMessage(telegramHandler, body)
          .then(({ userChatId, toStart }) => toStart && this.afterMessage(userChatId))
          .catch(err => log.error(err));
        break;
      }
      case telegramMessageTypes.callback_query: {
        this.onQuickReplies(telegramHandler, body)
          .then(({ userChatId, toStart }) => toStart && this.afterMessage(userChatId))
          .catch(err => log.error(err));
        break;
      }
    }
  }

  async onMessage(handler, pack) {
    const userChatId = handler.getUserChatId(pack);
    const text = handler.getText(pack);
    let controller;
    for (const contr of this.controllers.message) {
      const result = await contr.canHandle(text);
      if (result) {
        controller = contr;
        break;
      }
    }
    if (!controller) {
      return await this.canNotHandle(userChatId);
    }
    const result = await controller.handler({ userChatId, text });
    if (!result) {
      return await this.canNotController(userChatId);
    }
    const message = await this.telegram.sendMessage(userChatId, result.message);
    const { afterSend } = result;
    console.log(afterSend);
    if (afterSend.length) {
      afterSend.forEach(event => {
        this[event](userChatId, message.message_id);
      });
    }
    return { toStart: result.toStart, userChatId };
  }

  async afterMessage(userChatId) {
    await this.telegram.sendMessage(userChatId, "Це базове повідомлення, яке з'являється, коли всі дії виконані");
    // reply_markup: JSON.stringify({
    //     inline_keyboard: [
    //       [{ text: 'Встановити мій статус реагувальника', callback_data: callbackQueryType.status.responder.set }],
    //     ],
    //   })
  }

  async canNotHandle(userChatId) {
    await this.telegram.sendMessage(userChatId, 'Not found controller');
    return userChatId;
  }

  async onQuickReplies(handler, pack) {
    const userChatId = handler.getUserChatId(pack);
    const userProfile = await findResponder(userChatId);
    const value = handler.getQuery(pack).split('_');
    const query = value.shift();
    let controller;
    for (const contr of this.controllers.callbackQuery) {
      if (contr.action[query]) {
        controller = contr.action[query];
        break;
      }
    }
    if (!controller) return await this.canNotHandle(userChatId);
    console.log("");

    const result = await controller({ userProfile, value }).progress(async message => {
      log.info('call after');
      await this.telegram.sendMessage(userChatId, message);
    });

    if (!result) return await this.canNotController(userChatId);
    const message = await this.telegram.sendMessage(userChatId, result.message);
    return { toStart: result.toStart, userChatId };
  }
}

module.exports = { TelegrafBot };
