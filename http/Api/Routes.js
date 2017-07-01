const PingController = require('./Controllers/PingController')
const EmailController = require('./Controllers/EmailController')

module.exports = function (router) {
  router.get('/v1/ping', PingController.getPing)

  router.post('/v1/email/send', EmailController.postSend)
  router.get('/v1/email/status/:id', EmailController.getStatus)
}
