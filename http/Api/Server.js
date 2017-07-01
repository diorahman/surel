const Koa = require('koa')
const uuid = require('uuid').v4
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

class Api {
  constructor (routes) {
    const router = new Router()
    this.app = new Koa()

    this.app.use(bodyParser({
      enableTypes: ['json'],
      jsonLimit: '1mb'
    }))

    this.app.use(this.track)
    this.app.use(this.json)
    this.app.use(this.error)

    routes(router)
    this.app.use(router.routes())
      .use(router.allowedMethods({throw: true}))

    this.app.on('error', (err) => {
      console.log('Uncaught exception', err.message, err.stack)
    })
  }

  async json (ctx, next) {
    ctx.json = function (payload, status = 200) {
      ctx.type = 'application/json'
      ctx.status = status
      ctx.body = payload
    }

    await next()
  }

  async track (ctx, next) {
    ctx.requestId = uuid.v4()
    ctx.set('Request-ID', ctx.requestId)
    await next()
  }

  async error (ctx, next) {
    try {
      await next()
    } catch (error) {
      ctx.json({
        requestId: ctx.requestId
      }, 500)
    }
  }

  listen (port, fn) {
    this.app.listen(port, (err) => {
      if (fn) {
        return fn(err)
      }

      console.log(`-> ${port}`)
    })
  }
}

function boot (routes, port, fn) {
  const api = new Api(routes)
  api.listen(port, fn)
}

module.exports = exports = Api
exports.boot = boot
