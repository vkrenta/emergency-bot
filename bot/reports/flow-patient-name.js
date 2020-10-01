const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientName = new Scene('getPatientName');
  const confirmPatientName = new Scene('confirmPatientName');
  const editPatientName = new Scene('editPatientName');

  stage.register(getPatientName);
  stage.register(confirmPatientName);
  stage.register(editPatientName);

  getPatientName.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.skipEnter) {
      ctx.session.patientName = '';
      await ctx.reply(
        ctx.texts.getDocument('enter_name').options.skip,
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientName');
    } else {
      ctx.session.patientName = ctx.message.text;
      await ctx.reply(
        /*`Ім'я та прізвище пацієнта  - ${ctx.message.text}, вірно?`*/
        ctx.texts
          .getDocument('enter_name')
          .options.confirmName.replace('{{name}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientName');
    }
  });

  confirmPatientName.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      if (ctx.session.pAge != null) {
        ctx.session.patientAge = ctx.session.pAge;
        if (ctx.session.pSex != null) {
          ctx.session.patientGender = ctx.session.pSex;
          await ctx.reply(ctx.texts.getDocument('enter_weight').text, {
            reply_markup: { remove_keyboard: true }
          });
          await ctx.scene.enter('getPatientWeight');
        } else {
          await ctx.reply(
            ctx.texts.getDocument('select_sex').text,
            keyboards.getPatientGenderKeyboard
          );
          await ctx.scene.enter('getPatientGender');
        }
      } else {
        await ctx.reply(ctx.texts.getDocument('enter_age').text, {
          reply_markup: { remove_keyboard: true }
        });
        await ctx.scene.enter('getPatientAge');
      }
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(
        ctx.texts.getDocument('edit_result').options.name,
        keyboards.skipKeyboard
      );
      await ctx.scene.enter('getPatientName');
    }
  });

  editPatientName.on('text', async ctx => {
    ctx.session.patientName = ctx.message.text;
    await ctx.reply(
      ctx.texts
        .getDocument('enter_name')
        .options.reportName.replace('{{name}}', ctx.session.patientName),
      keyboards.continueKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });
};
