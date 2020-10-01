const { BaseScene: Scene } = require('telegraf');
const {
  Responder: { setStatus }
} = require('../../mongo/methods');
const {
  util: { request }
} = require('../../helpers');
const { chatBotAPI } = require('../../helpers/enums');
const Markup = require('telegraf/markup');

module.exports = stage => {
  const setResponderStatus = new Scene('setResponderStatus');
  stage.register(setResponderStatus);

  setResponderStatus.on('text', async ctx => {
    const {
      text,
      options: { Ready, Busy, Offduty, cant_change }
    } = ctx.texts.getDocument('responder_status_changed');
    const statuses = new Map();
    statuses
      .set('Ready', text.replace('{{status}}', Ready))
      .set('Busy', text.replace('{{status}}', Busy))
      .set('Offduty', text.replace('{{status}}', Offduty));

    const status = ctx.message.text;
    if (!statuses.has(status))
      return ctx.scene
        .leave()
        .then(() => ctx.reply(cant_change, Markup.removeKeyboard().extra()));

    const answer = statuses.get(status);
    await setStatus(ctx.message.chat.id, status);
    const { userProfile } = ctx.session;
    console.log(ctx.session);

    const params = await chatBotAPI.respondersStatusUrl(
      userProfile.responderId,
      status
    );
    const result = await request({ isInternal: true, ...params });
    if (result.statusCode !== 200) {
      await ctx.reply(cant_change, Markup.removeKeyboard().extra());
    } else if (result.statusCode === 200) {
      await ctx.reply(answer, Markup.removeKeyboard().extra());
    }
    await ctx.scene.leave();
  });
};
