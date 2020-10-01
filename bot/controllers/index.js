module.exports = {
  message: [
    require('./tellMe'),
    require('./toStart'),
    require('./onStatus'),
    require('./viewstatus')
  ],
  callbackQuery: [
    require('./setStatusResponder'),
    require('./setStatusCard'),
    require('./cardShowOnMap')
  ]
}