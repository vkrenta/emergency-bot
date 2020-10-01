const { BaseScene: Scene } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientWeight = new Scene('getPatientWeight');
  const confirmPatientWeight = new Scene('confirmPatientWeight');
  const editPatientWeight = new Scene('editPatientWeight');

  stage.register(getPatientWeight);
  stage.register(confirmPatientWeight);
  stage.register(editPatientWeight);

  getPatientWeight.on('text', async ctx => {
    const weight = parseInt(ctx.message.text);
    if (
      isNaN(weight) ||
      weight.toString() !== ctx.message.text ||
      weight <= 0 ||
      weight > 200
    ) {
      await ctx.reply(ctx.texts.getDocument('enter_weight').options.incorrect);
      await ctx.scene.enter('getPatientWeight');
    } else {
      ctx.session.patientWeight = weight;
      await ctx.reply(
        /*`Вага пацієнта  - ${ctx.message.text}, вірно?`*/
        ctx.texts
          .getDocument('enter_weight')
          .options.confirmWeight.replace('{{weight}}', ctx.message.text),
        keyboards.confirmKeyboard
      );
      await ctx.scene.enter('confirmPatientWeight');
    }
  });

  confirmPatientWeight.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      await ctx.reply(
        ctx.texts.getDocument('confirm_diagnosis').options.selectReasonNow,
        keyboards.getDiagnosisKeyboardPart1
      );
      await ctx.scene.enter('getPatientDiagnosis');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      await ctx.reply(ctx.texts.getDocument('edit_result').options.weight);
      await ctx.scene.enter('getPatientWeight');
    }
  });

  editPatientWeight.on('text', async ctx => {
    ctx.session.patientWeight = ctx.message.text;
    await ctx.reply(
      /*`Вага пацієнта - ${ctx.session.patientWeight}
      \nЩоб переглянути результат звіту, натисність "Продовжити"`*/
      ctx.texts
        .getDocument('enter_weight')
        .options.confirmWeight.replace('{{weight}}', ctx.session.patientWeight),
      keyboards.continueKeyboard
    );
    await ctx.scene.enter('confirmPatientResult');
  });
};
