const EmailService = require('../Services/Email')

module.exports = class EmailController {
  static async postSend (ctx, next) {
    ctx.json(await EmailService.send(ctx.request.body))
  }
}
