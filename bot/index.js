/* eslint-disable no-undef */
const Telegraf = require('telegraf');
const { session } = Telegraf;
const reportFlow = require('./reports');
const statusFlow = require('./statuses');
const setStatus = require('./controllers/setStatusResponder');
const callCardFlow = require('./flows/setCallStatus');
const getStaticTexts = require('../mongo/texts');

module.exports.setup = async function(app) {
  const bot = new Telegraf(process.env.telegramBotToken);

  await app.use(bot.webhookCallback('/telegraf'));
  await bot.telegram.setWebhook(`${process.env.HOST_URL}/telegraf`);
  await bot.use(session());
  statusFlow && bot.use(statusFlow(bot).middleware());
  setStatus(bot);
  reportFlow && reportFlow(bot);
  callCardFlow && callCardFlow(bot);

  let mongoError = null;
  bot.context.texts = {};
  bot.context.texts.allDocuments = await getStaticTexts().catch(err => {
    mongoError = err;
  });
  let emptyError =
    !bot.context.texts ||
    !bot.context.texts.allDocuments ||
    !bot.context.texts.allDocuments.length;
  if (emptyError || mongoError) console.error('Cant get any document from DB');
  if (emptyError) throw new Error('Texts are empty');
  if (mongoError) throw mongoError;
  bot.context.texts.getDocument = function(name) {
    return this.allDocuments.find(element => element.name === name);
  };

  setInterval(async () => {
    mongoError = null;
    emptyError = null;
    const texts = {};
    texts.allDocuments = await getStaticTexts().catch(err => {
      mongoError = err;
    });
    texts.getDocument = function(name) {
      return this.allDocuments.find(element => element.name === name);
    };

    emptyError = !texts || !texts.allDocuments || !texts.allDocuments.length;
    if (emptyError || mongoError)
      console.error('Cant get any document from DB');
    else {
      bot.context.texts = texts;
    }
    if (emptyError) throw new Error('Texts are empty');
    if (mongoError) throw mongoError;
  }, 1800000);

  // TODO Refactor this part
  // Create separate file for inline btns
  bot.action(/^(call-location)/, async ctx => {
    const {
      callbackQuery: { data }
    } = ctx;
    const [, chatId, latitude, longitude] = data.split('|');
    await bot.telegram.sendLocation(parseInt(chatId, 10), latitude, longitude);
    await bot.telegram.answerCbQuery(ctx.callbackQuery.id);
  });

  return bot;
};
module.exports.helper = require('./helper');
