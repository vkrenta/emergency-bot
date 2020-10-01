const { BaseScene: Scene } = require('telegraf');
const Markup = require('telegraf/markup');

module.exports = stage => {
  const start = new Scene('start');
  stage.register(start);

  start.on('text', async ctx => {
    if (ctx.message.text === 'Розпочати заповнення форми') {
      await ctx.reply(
        ctx.texts.getDocument('enter_name').text,
        Markup.removeKeyboard().extra()
      );
      ctx.scene.enter('getPatientName');
    }
  });
};
