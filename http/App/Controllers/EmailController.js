const EmailService = require('../Services/Email')

module.exports = class EmailController {
  static async postSend (ctx, next) {
    const {body, statusCode} = await EmailService.send(ctx.request.body)
    ctx.json(body, statusCode)
  }
}
