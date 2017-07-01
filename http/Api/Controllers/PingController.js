module.exports = class PingController {
  static getPing (ctx, next) {
    ctx.json({ping: 'pong'})
  }
}
