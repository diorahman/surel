require('dotenv').load()

const test = require('ava')
const http = require('http')
const {agent} = require('supertest')

const Server = require('../../../../http/Api/Server')
const routes = require('../../../../http/Api/Routes')

test('send via sendgrid', async (t) => {
  const {app} = new Server(routes)
  const tester = agent(http.createServer(app.callback()))

  const response = await tester
    .post('/v1/email/send')
    .set('Content-Type', 'application/json')
    .send({
      subject: 'Hello',
      from: 'Dhi Aurrahman <diorahman@rockybars.com>',
      to: 'Dhi Aurrahman <diorahman@gmail.com>',
      contentType: 'text/html',
      body: '<b>OK!</b>'
    })
    .expect(200)

  t.true(response.body.success)
})
