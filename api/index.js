const express = require('express');
const router = express.Router();
const { secretValidation } = require('../helpers/middleware');
const { createResponder, deleteResponder, readResponder, updateResponder } = require('./responder');
const CreateCard = require('./create-card');
const Report = require('./reports');
const intersaction = (arr1, arr2) => arr1.filter(v => -1 !== arr2.indexOf(v));
module.exports = function(bot) {
  router.use(secretValidation);

  const methods = {
    ChatBotCall: CreateCard(bot),
    Report: Report(bot),
  };
  router.post('/api/chatbot', (req, res) => {
    const [key] = intersaction(Object.keys(methods), Object.keys(req.body));
    if (!methods[key]) {
      return res.status(400).send({ message: 'Not found handler for this request' });
    }
    return methods[key](req, res);
  });

  router.post('/api/responders', createResponder);
  router.get('/api/responders', readResponder);
  router.put('/api/responders/:responderId', updateResponder);
  router.delete('/api/responders/:responderId', deleteResponder);

  return router;
};
