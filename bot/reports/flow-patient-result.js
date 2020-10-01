const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientResult = new Scene('getPatientResult');
  const confirmPatientResult = new Scene('confirmPatientResult');
  const editPatientResult = new Scene('editPatientResult');

  stage.register(getPatientResult);
  stage.register(confirmPatientResult);
  stage.register(editPatientResult);

  getPatientResult.on('text', async ctx => {
    ctx.session.patientResult = ctx.message.text;
    await ctx.reply(
      /*`Результат наданої допомоги  - ${ctx.message.text}, вірно?`*/
      ctx.texts
        .getDocument('help_result')
        .options.result.replace('{{result}}', ctx.message.text),
      keyboards.confirmKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });

  confirmPatientResult.on('text', async ctx => {
    if (
      ctx.message.text === buttonTexts.allRight ||
      ctx.message.text === buttonTexts.Continue
    ) {
      ctx.session.editing = false;
      await ctx.reply(
        /*`Дякуємо, опитування завершено!\nОтримані дані:\nІм'я пацієнта: ${ctx.session.patientName}
        \nВік пацієнта: ${ctx.session.patientAge}
        \nСтать пацієнта: ${ctx.session.patientGender}\
        nВага пацієнта: ${ctx.session.patientWeight}
        \nПричина виклику: ${ctx.session.patientDiagnosisCode} - ${ctx.session.patientDiagnosis}\
        nНадана допомога: ${ctx.session.patientHelp}\nКоментар до наданої допомоги: ${ctx.session.patientHelpComment}
        Результат: ${ctx.session.patientResult}\n
        \nВсе вірно?`*/
        ctx.texts
          .getDocument('ending')
          .text.replace('{{name}}', ctx.session.patientName)
          .replace('{{age}}', ctx.session.patientAge.toString())
          .replace('{{sex}}', ctx.session.patientGender)
          .replace('{{weight}}', ctx.session.patientWeight.toString())
          .replace('{{reason_code}}', ctx.session.patientDiagnosisCode)
          .replace('{{reason}}', ctx.session.patientDiagnosis)
          .replace('{{help}}', ctx.session.patientHelp)
          .replace('{{comment}}', ctx.session.patientHelpComment)
          .replace('{{result}}', ctx.session.patientResult),
        {
          reply_markup: {
            keyboard: [['Так, все вірно'], ['Ні, потрібне редагування']],
            one_time_keyboard: true,
            resize_keyboard: true
          }
        }
      );
      await ctx.scene.enter('confirmAll');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(
        ctx.texts.getDocument('edit_result').options.result,
        keyboards.getResultKeyboard
      );
      await ctx.scene.enter('getPatientResult');
    }
  });

  editPatientResult.on('text', async ctx => {
    ctx.session.patientResult = ctx.message.text;
    await ctx.reply(
      /*`Результат наданої допомоги - ${ctx.session.patientResult}
      \nЩоб переглянути результат звіту, натисність "Продовжити"`*/
      ctx.texts
        .getDocument('help_result')
        .options.resultAndReport.replace(
          '{{result}}',
          ctx.session.patientResult
        ),
      keyboards.continueKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });
};
