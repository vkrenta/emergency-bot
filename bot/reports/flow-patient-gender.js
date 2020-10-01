const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientGender = new Scene('getPatientGender');
  const confirmPatientGender = new Scene('confirmPatientGender');
  const editPatientGender = new Scene('editPatientGender');

  stage.register(getPatientGender);
  stage.register(confirmPatientGender);
  stage.register(editPatientGender);

  getPatientGender.on('text', async ctx => {
    if (
      ctx.message.text === buttonTexts.man ||
      ctx.message.text === buttonTexts.woman
    ) {
      ctx.session.patientGender = ctx.message.text;
      await ctx.reply(
        /*`Стать пацієнта - ${ctx.message.text}, вірно?`*/
        ctx.texts
          .getDocument('select_sex')
          .options.isRight.replace('{{sex}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientGender');
    } else {
      await ctx.reply(
        // 'Стать обрана не вірно.\nБудь ласка, оберіть стать за допомогою кнопок.'
        ctx.texts.getDocument('select_sex').options.incorrect
      );
      await ctx.scene.enter('getPatientGender');
    }
  });

  confirmPatientGender.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      await ctx.reply(ctx.texts.getDocument('enter_weight').text, {
        reply_markup: { remove_keyboard: true }
      });
      await ctx.scene.enter('getPatientWeight');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(
        ctx.texts.getDocument('edit_result').options.sex,
        keyboards.getPatientGenderKeyboard
      );
      await ctx.scene.enter('getPatientGender');
    }
  });

  editPatientGender.on('text', async ctx => {
    if (
      ctx.message.text === buttonTexts.man ||
      ctx.message.text === buttonTexts.woman
    ) {
      ctx.session.patientGender = ctx.message.text;
      await ctx.reply(
        /*`Стать пацієнта - ${ctx.session.patientGender}\nЩоб переглянути результат звіту, натисність "Продовжити"`*/
        ctx.texts
          .getDocument('select_sex')
          .options.isRight.replace('{{sex}}', ctx.session.patientGender),
        keyboards.continueKeyboard
      );
      await ctx.scene.enter('confirmPatientResult');
    }
  });
};
