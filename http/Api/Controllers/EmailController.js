const EmailService = require('../Services/Email')

module.exports = class EmailController {
  static async postSend (ctx, next) {
    const email = ctx.request.body
    email.id = ctx.requestId

    ctx.json(await EmailService.send(email, email.service))
  }

  static getStatus (ctx, next) {
    ctx.json({ping: 'pong'})
  }
}
