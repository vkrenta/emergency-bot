const { BaseScene: Scene } = require('telegraf');
const Markup = require('telegraf/markup');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');
const {
  util: { request }
} = require('../../helpers');
const { chatBotAPI } = require('../../helpers/enums');

function formatDateTime(input) {
  const epoch = new Date(0);
  epoch.setSeconds(parseInt(input));
  let date = epoch.toISOString();
  date = date.replace('T', ' ');
  return (
    date.split('.')[0].split(' ')[0] +
    ' ' +
    epoch.toLocaleTimeString().split(' ')[0]
  );
}

module.exports = stage => {
  const confirmAll = new Scene('confirmAll');
  stage.register(confirmAll);

  confirmAll.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      // id = ctx.message.chat.id;
      const callCardId = ctx.session.callCardId;
      const messageDate = ctx.message.date;
      const time = formatDateTime(messageDate);
      const responderId = ctx.session.responderId;
      const params = await chatBotAPI.sendReportURL(
        responderId,
        callCardId,
        time,
        ctx.session
      );
      const result = await request({ isInternal: true, ...params });

      console.log(`statusCode:${result.statusCode} body: ${result.body}`);

      if (result.statusCode !== 200) {
        await ctx.reply(
          ctx.texts.getDocument('confirmed_all').options.error,
          Markup.removeKeyboard().extra()
        );
        await ctx.scene.leave();
      } else {
        await ctx.reply(
          ctx.texts.getDocument('confirmed_all').options.success,
          Markup.removeKeyboard().extra()
        );
        await ctx.scene.leave();
      }
    } else if (ctx.message.text === buttonTexts.needEdit) {
      await ctx.reply(
        ctx.texts.getDocument('what_reenter').text,
        keyboards.getEditKeyboard
      );
      await ctx.scene.enter('editPatientReportResult');
    }
  });
};
