const { BaseScene: Scene } = require('telegraf');
const { Markup } = require('telegraf');
const keyboards = require('./keyboards');
const { buttonTexts } = require('../../helpers/enums');

module.exports = stage => {
  const getPatientHelp = new Scene('getPatientHelp');
  const confirmPatientHelp = new Scene('confirmPatientHelp');

  stage.register(getPatientHelp);
  stage.register(confirmPatientHelp);

  const triggers = new Map();
  triggers
    .set('cardio', {
      title: 'Кардіостимуляція',
      indexes: { x: 0, y: 0 }
    })
    .set('defibrillation', {
      title: 'Дефібріляція',
      indexes: { x: 0, y: 1 }
    })
    .set('compression', {
      title: 'Компресія грудної клітини',
      indexes: { x: 1, y: 0 }
    })
    .set('plait', {
      title: 'Джгут',
      indexes: { x: 1, y: 1 }
    })
    .set('imbolization', {
      title: 'Імболізація',
      indexes: { x: 2, y: 0 }
    })
    .set('bandage', {
      title: "Пов'язка",
      indexes: { x: 2, y: 1 }
    });

  getPatientHelp.on('text', async ctx => {
    ctx.reply(ctx.texts.getDocument('select_help').options.selectButtons);
  });

  getPatientHelp.action([...triggers.keys()], async ctx => {
    const trigger = triggers.get(ctx.match);
    const { x, y } = trigger.indexes;
    const { title } = trigger;
    if (ctx.session.helpList.includes(title)) {
      ctx.session.editedPatientHelpKeyboard[x][y].text = title;
      ctx.session.helpList = ctx.session.helpList.filter(
        elem => elem !== title
      );
    } else {
      ctx.session.editedPatientHelpKeyboard[x][y].text = `✅${title}`;
      ctx.session.helpList.push(title);
    }
    await ctx.editMessageReplyMarkup(
      Markup.inlineKeyboard(ctx.session.editedPatientHelpKeyboard)
    );
    await ctx.answerCbQuery();
  });

  getPatientHelp.action('nextStep', async ctx => {
    if (ctx.session.helpList.length === 0) {
      ctx.reply(ctx.texts.getDocument('select_help').options.selectButtons);
    } else {
      ctx.session.patientHelp = ctx.session.helpList;
      if (!ctx.session.editing) {
        await ctx.reply(
          /*`Надана пацієнтові допомога:\n${ctx.session.helpList.join(
            '\n'
          )}\nЧи всі дані введено вірно?`*/
          ctx.texts
            .getDocument('select_help')
            .options.confirm.replace(
              '{{help}}',
              ctx.session.helpList.join('\n')
            ),
          keyboards.confirmKeyboard
        );
        await ctx.scene.enter('confirmPatientHelp');
      } else {
        ctx.session.editing = false;
        await ctx.reply(
          ctx.texts
            .getDocument('select_help')
            .options.confirmAndReport.replace(
              '{{help}}',
              ctx.session.helpList.join('\n')
            ),
          keyboards.continueKeyboard
        );
        await ctx.scene.enter('confirmPatientResult');
      }
    }
    await ctx.answerCbQuery();
  });

  confirmPatientHelp.on('text', async ctx => {
    if (ctx.message.text === buttonTexts.allRight) {
      await ctx.reply(
        ctx.texts.getDocument('help_comment').text,
        keyboards.skipKeyboard
      );
      await ctx.scene.enter('getPatientHelpComment');
    } else if (ctx.message.text === buttonTexts.iWantReenter) {
      ctx.session.patientHelp = '';
      ctx.session.helpList = [];
      triggers.forEach(element => {
        const { x, y } = element.indexes;
        const { title } = element;
        ctx.session.editedPatientHelpKeyboard[x][y].text = title;
      });
      await ctx.reply(
        ctx.texts.getDocument('select_help').options.wantReenter,
        {
          reply_markup: {
            remove_keyboard: true,
            inline_keyboard: ctx.session.editedPatientHelpKeyboard
          }
        }
      );
      await ctx.scene.enter('getPatientHelp');
    }
  });
};
