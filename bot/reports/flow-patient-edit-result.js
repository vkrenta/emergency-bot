const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');

module.exports = stage => {
  const editPatientReportResult = new Scene('editPatientReportResult');

  stage.register(editPatientReportResult);

  editPatientReportResult.on('text', async ctx => {
    const {
      options: { name, sex, age, weight, reason, help, comment, result }
    } = ctx.texts.getDocument('edit_result');
    if (ctx.message.text === "Ім'я пацієнта") {
      await ctx.reply(name, { reply_markup: { remove_keyboard: true } });
      await ctx.scene.enter('editPatientName');
    }

    if (ctx.message.text === 'Вік пацієнта') {
      await ctx.reply(age, { reply_markup: { remove_keyboard: true } });
      await ctx.scene.enter('editPatientAge');
    }

    if (ctx.message.text === 'Стать пацієнта') {
      await ctx.reply(sex, keyboards.getPatientGenderKeyboard);
      await ctx.scene.enter('editPatientGender');
    }

    if (ctx.message.text === 'Вага пацієнта') {
      await ctx.reply(weight, { reply_markup: { remove_keyboard: true } });
      await ctx.scene.enter('editPatientWeight');
    }

    if (ctx.message.text === 'Причина виклику') {
      await ctx.reply(reason, keyboards.getDiagnosisKeyboardPart1);
      await ctx.scene.enter('editPatientDiagnosis');
    }

    if (ctx.message.text === 'Надана допомога') {
      ctx.session.editing = true;
      await ctx.reply(help, {
        reply_markup: { inline_keyboard: ctx.session.editedPatientHelpKeyboard }
      });
      await ctx.scene.enter('getPatientHelp');
    }

    if (ctx.message.text === 'Коментар до наданої допомоги') {
      await ctx.reply(comment, { reply_markup: { remove_keyboard: true } });
      await ctx.scene.enter('editPatientComment');
    }

    if (ctx.message.text === 'Результат') {
      await ctx.reply(result, keyboards.getResultKeyboard);
      await ctx.scene.enter('editPatientResult');
    }
  });
};
