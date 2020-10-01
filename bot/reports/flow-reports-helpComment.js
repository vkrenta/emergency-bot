const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientHelpComment = new Scene('getPatientHelpComment');
  const confirmPatientComment = new Scene('confirmPatientComment');
  const editPatientComment = new Scene('editPatientComment');

  stage.register(getPatientHelpComment);
  stage.register(confirmPatientComment);
  stage.register(editPatientComment);

  getPatientHelpComment.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.skipEnter) {
      ctx.session.patientHelpComment = '';
      await ctx.reply(
        ctx.texts.getDocument('help_comment').options.skip,
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientComment');
    } else {
      ctx.session.patientHelpComment = ctx.message.text;
      await ctx.reply(
        /*`Коментар до допомоги  - ${ctx.message.text}, вірно?`*/
        ctx.texts
          .getDocument('help_comment')
          .options.confirmComment.replace('{{comment}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientComment');
    }
  });

  confirmPatientComment.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      await ctx.reply(
        ctx.texts.getDocument('help_result').text,
        keyboards.getResultKeyboard
      );
      await ctx.scene.enter('getPatientResult');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(ctx.texts.getDocument('edit_result').options.comment, {
        reply_markup: {
          keyboard: [[`Пропустити`]],
          one_time_keyboard: true,
          resize_keyboard: true
        }
      });
      await ctx.scene.enter('getPatientHelpComment');
    }
  });

  editPatientComment.on('text', async ctx => {
    ctx.session.patientHelpComment = ctx.message.text;
    await ctx.reply(
      /*`Коментар - ${ctx.session.patientHelpComment}\nЩоб переглянути результат звіту, натисність "Продовжити"`*/
      ctx.texts
        .getDocument('help_comment')
        .options.commentAndReport.replace(
          '{{comment}}',
          ctx.session.patientHelpComment
        ),
      keyboards.continueKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });
};
