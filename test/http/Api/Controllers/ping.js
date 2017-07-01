require('dotenv').load()

const test = require('ava')
const http = require('http')
const {agent} = require('supertest')

const Server = require('../../../../http/Api/Server')
const routes = require('../../../../http/Api/Routes')

test('pong', async (t) => {
  const {app} = new Server(routes)
  const tester = agent(http.createServer(app.callback()))

  const response = await tester
    .get('/v1/ping')
    .expect(200)

  t.deepEqual(response.body, {ping: 'pong'})
})
