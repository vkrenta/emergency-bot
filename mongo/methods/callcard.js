const { callCardModel } = require('../model');

module.exports.createCallCard = card => new callCardModel(card).save();
module.exports.findCallCard = callCardId=> callCardModel.findOne({ callCardId }).exec();
module.exports.deleteCard = callCardId => callCardModel.findOneAndDelete({ callCardId }).exec();

