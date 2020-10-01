const { textsModel } = require('../model');

const findDocuments = () =>
  textsModel
    .find({})
    .exec()
    .then(res => {
      console.log('All texts has been reloaded');
      return res;
    });

module.exports = findDocuments;
