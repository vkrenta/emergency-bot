const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');
const {
  Responder: { findResponder }
} = require('../../mongo/methods');

module.exports = stage => {
  const getPatientAge = new Scene('getPatientAge');
  const confirmPatientAge = new Scene('confirmPatientAge');
  const editPatientAge = new Scene('editPatientAge');

  stage.register(getPatientAge);
  stage.register(confirmPatientAge);
  stage.register(editPatientAge);

  getPatientAge.on('text', async ctx => {
    const userProfile = await findResponder(ctx.message.from.id);
    ctx.session.responderId = userProfile.responderId;

    const age = parseFloat(ctx.message.text);
    if (
      isNaN(age) ||
      age.toString() !== ctx.message.text ||
      age <= 0 ||
      age > 120
    ) {
      await ctx.reply(ctx.texts.getDocument('enter_age').options.incorrect);
      await ctx.scene.enter('getPatientAge');
    } else {
      ctx.session.patientAge = ctx.message.text;
      await ctx.reply(
        ctx.texts
          .getDocument('confirm_age')
          .text.replace('{{age}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientAge');
    }
  });

  confirmPatientAge.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      if (ctx.session.pSex != null) {
        ctx.session.patientGender = ctx.session.pSex;
        await ctx.reply(ctx.texts.getDocument('enter_weight').text);
        await ctx.scene.enter('getPatientWeight');
      } else {
        await ctx.reply(
          ctx.texts.getDocument('select_sex').text,
          keyboards.getPatientGenderKeyboard
        );
        await ctx.scene.enter('getPatientGender');
      }
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(ctx.texts.getDocument('edit_result').options.age, {
        reply_markup: { remove_keyboard: true }
      });
      await ctx.scene.enter('getPatientAge');
    }
  });

  editPatientAge.on('text', async ctx => {
    ctx.session.patientAge = ctx.message.text;
    await ctx.reply(
      /*`Вік пацієнта - ${ctx.session.patientAge}
      Щоб переглянути результат звіту, натисність "Продовжити"`*/
      ctx.texts
        .getDocument('edit_age')
        .text.replace('{{age}}', ctx.session.patientAge),
      keyboards.continueKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });
};
