const express = require('express');
const router = express.Router();

module.exports = function (bot) {
  router.post(`/telegram`, (req, res) => {
    bot.haveMessage(req.body)
      .then(() => res.status(200).send({ message: 'ok' }))
      .catch(err => res.status(200).send({ error: err }));
  });

  router.get(`/telegram`, (req, res) => res.send({ message: 'ok' }));

  return router;
};