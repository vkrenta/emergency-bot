const { responderModel } = require('../model');

module.exports.createResponder = (chatId, responderId) =>
  new responderModel({ chatId, responderId }).save();
module.exports.findResponder = chatId =>
  responderModel.findOne({ chatId }).exec();
module.exports.findResponders = () => responderModel.find().exec();
module.exports.updateResponder = (responderId, chatId) =>
  responderModel
    .findOneAndUpdate({ responderId }, { $set: { chatId } }, { new: true })
    .exec();
module.exports.deleteResponder = responderId =>
  responderModel.findOneAndDelete({ responderId }).exec();

module.exports.findTelegramUser = responderId =>
  responderModel
    .findOne({ responderId })
    .exec()
    .then(data => {
      if (data.chatId) return data;
      const err = new Error('Not found chat_id for responderId ' + responderId);
      err.code = 1000;
      throw err;
    });
module.exports.setStatus = (chatId, status) =>
  responderModel
    .findOneAndUpdate({ chatId }, { $set: { status } }, { new: true })
    .exec();
