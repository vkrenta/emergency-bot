const { log } = require('../helpers');
const {
  Responder: { findResponder, findTelegramUser }
} = require('../mongo/methods');
const {
  CallCard: { findCallCard }
} = require('../mongo/methods');

module.exports = bot => async (req, res) => {
  const responderId = req.body.Report.responder_id;
  const callCardId = req.body.Report.call_card_id;
  findTelegramUser(responderId)
    .then(async userProfile => {
      const id = userProfile.chatId;
      findResponder(id)
        .then(async data => {
          if (data) {
            await bot.telegram
              .sendMessage(
                id,
                `Вітаємо вас в формі вводу даних пацієнта, давайте почнемо.\nНомер вашого виклику: ${callCardId}.`,
                {
                  reply_markup: {
                    keyboard: [[`Розпочати заповнення форми_${callCardId}`]]
                  }
                }
              )
              .then(() => {
                res.status(200).send({
                  message: `Респондера з chatId ${id} знайдено, форму запиту даних відправлено!`
                });
              })
              .catch(err => {
                log.error(
                  `[error][event:create-card][method:send-message] ${err.toString()}`
                );
                if (err.description === 'Bad Request: chat not found') {
                  return res
                    .status(400)
                    .send({
                      message: `Not found chatId for responderId: ${responderId} in DB record`,
                      code: 1001
                    });
                }
                return res.status(500).send({
                  message: 'internal server error',
                  code: 0,
                  err: err.toString()
                });
              });
          } else {
            res.status(400).send({
              message: `Responder with chatId ${id} doesn\`t exist`
            });
          }
        })
        .catch(() =>
          res.status(400).send({
            message: `Responder with chatId ${id} doesn\`t exist`
          })
        );
    })
    .catch(() =>
      res.status(400).send({
        message: `UserProfile with responderId ${responderId} doesn\`t exist`,
        code: 1000
      })
    );
};
