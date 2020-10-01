const { messageType } = require('../../helpers/enums');
const { log } = require('../../helpers');

async function canHandle(text) {
  const result = text == 'Start';
  log.info(`[skill][to-start] canHandle: ${result}`);
  return result;
}

async function handler() {
  return { 
    toStart: true ,
    afterSend: []
  };
}

module.exports = {
  canHandle,
  handler,
};
