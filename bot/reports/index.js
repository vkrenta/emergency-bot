const { Stage, Markup } = require('telegraf');
const path = require('path');
const keyboards = require('./keyboards');
const { log } = require('../../helpers');

const stage = new Stage();

const {
  CallCard: { findCallCard }
} = require('../../mongo/methods');

module.exports = bot => {
  try {
    // eslint-disable-next-line no-undef
    require('fs')
      .readdirSync(path.join(__dirname))
      .forEach(function(file) {
        if (file.match(/^flow.*\.js$/)) {
          const name = file.replace('.js', '');
          require(`./${name}`)(stage, bot);
        }
      });

    bot.use(stage.middleware());
    bot.on('message', async (ctx, next) => {
      try {
        if (
          /Розпочати заповнення форми_ER-\d{4}-\d{2}-\d{2}-\d.+/.test(
            ctx.message.text
          )
        ) {
          console.log(ctx.message.chat.id);
          ctx.session = {
            callCardId: ctx.message.text.substr(
              ctx.message.text.indexOf('_') + 1
            )
          };
          // const card = await findCallCard(ctx.session.callCardId);
          // if (card != null) {
          //   if (card.patient.age != null) {
          //     ctx.session.pAge = card.patient.age;
          //   }
          //   if (card.patient.sex != null) {
          //     ctx.session.pSex = card.patient.sex;
          //   }
          //   if (card.patient.name != null) {
          //     ctx.session.pName = card.patient.name;
          //   }
          // }

          log.debug(`callCardId: ${ctx.session.callCardId}`);
          await ctx.reply(
            ctx.texts.getDocument('enter_name').text,
            keyboards.skipKeyboard
          );
          await ctx.scene.enter('getPatientName');
        }
        next();
      } catch (err) {
        log.error(err);
      }
    });
    return true;
  } catch (err) {
    log.error(
      `[error][stage:reports][event:get stage] err:${err.toString()}`,
      JSON.stringify(err)
    );
    console.log(err);
  }
  return null;
};
