const { BaseScene: Scene } = require('telegraf');
const Markup = require('telegraf/markup');
const keyboards = require('./keyboards');
const { buttonTexts, diagnosis } = require('../../helpers/enums');

module.exports = (stage, bot) => {
  const getPatientDiagnosis = new Scene('getPatientDiagnosis');
  const confirmPatientDiagnosis = new Scene('confirmPatientDiagnosis');
  const editPatientDiagnosis = new Scene('editPatientDiagnosis');

  stage.register(getPatientDiagnosis);
  stage.register(confirmPatientDiagnosis);
  stage.register(editPatientDiagnosis);

  getPatientDiagnosis.on('text', async ctx => {
    if (diagnosis.filter(elem => elem.text === ctx.message.text).length) {
      const index = diagnosis.findIndex(elem => elem.text === ctx.message.text);
      ctx.session.patientDiagnosisCode = diagnosis[index].code;
      ctx.session.patientDiagnosis = diagnosis[index].text;
      // await ctx.reply(`Причина виклику  - ${ctx.message.text}, вірно?`, keyboards.confirmKeyboard);
      await ctx.reply(
        ctx.texts
          .getDocument('confirm_diagnosis')
          .text.replace('{{reason}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientDiagnosis');
    } else if (ctx.message.text === buttonTexts.next) {
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('confirm_diagnosis').options.reason,
        keyboards.getDiagnosisKeyboardPart2
      );
      await ctx.scene.enter('getPatientDiagnosis');
    } else if (ctx.message.text === buttonTexts.prev) {
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('confirm_diagnosis').options.reason,
        keyboards.getDiagnosisKeyboardPart1
      );
      await ctx.scene.enter('getPatientDiagnosis');
    }
  });

  confirmPatientDiagnosis.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      ctx.session.editedPatientHelpKeyboard = JSON.parse(
        JSON.stringify(keyboards.getPatientHelpKeyboard)
      );
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('select_help').text,
        {
          reply_markup: {
            inline_keyboard: ctx.session.editedPatientHelpKeyboard
          }
        }
      );
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('select_help').options.selectButtons,
        { reply_markup: { remove_keyboard: true } }
      );
      ctx.session.patientHelp = '';
      ctx.session.helpList = [];
      await ctx.scene.enter('getPatientHelp');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(
        ctx.texts.getDocument('edit_result').options.reason,
        keyboards.getDiagnosisKeyboardPart1
      );
      await ctx.scene.enter('getPatientDiagnosis');
    }
  });

  editPatientDiagnosis.on('text', async ctx => {
    if (diagnosis.filter(elem => elem.text === ctx.message.text).length) {
      const index = diagnosis.findIndex(elem => elem.text === ctx.message.text);
      ctx.session.patientDiagnosisCode = diagnosis[index].code;
      ctx.session.patientDiagnosis = diagnosis[index].text;
      await ctx.reply(
        /*`Причина виклику - ${ctx.session.patientDiagnosis}\nЩоб переглянути результат звіту, натисність "Продовжити"`*/
        ctx.texts
          .getDocument('confirm_diagnosis')
          .options.reasonAndReport.replace(
            '{{reason}}',
            ctx.session.patientDiagnosis
          ),
        keyboards.continueKeyboard
      );
      await ctx.scene.enter('confirmPatientResult');
    } else if (ctx.message.text === buttonTexts.next) {
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('edit_result').options.reason,
        keyboards.getDiagnosisKeyboardPart2
      );
      await ctx.scene.enter('editPatientDiagnosis');
    } else if (ctx.message.text === buttonTexts.prev) {
      await bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.texts.getDocument('edit_result').options.reason,
        keyboards.getDiagnosisKeyboardPart1
      );
      await ctx.scene.enter('editPatientDiagnosis');
    }
  });
};
