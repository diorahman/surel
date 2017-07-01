require('dotenv').load()

const test = require('ava')
const EmailService = require('../../../../http/Api/Services/Email')
const Sender = require('../../../../lib/sender')

test('send via sendgrid', async (t) => {
  const email = {
    subject: 'Hello',
    from: 'Dhi Aurrahman <diorahman@rockybars.com>',
    to: 'Dhi Aurrahman <diorahman@gmail.com>',
    body: 'Hello!'
  }

  const result = await EmailService.send(email, Sender.Service.SENDGRID)

  t.true(result.success)
  t.deepEqual(result.service, Sender.Service.SENDGRID)
})

test('send via mandrill', async (t) => {
  const email = {
    subject: 'Hello',
    from: 'Dhi Aurrahman <diorahman@rockybars.com>',
    to: 'Dhi Aurrahman <diorahman@gmail.com>',
    body: 'Hello!'
  }

  const result = await EmailService.send(email, Sender.Service.MANDRILL)

  t.true(result.success)
  t.deepEqual(result.service, Sender.Service.MANDRILL)
})

test('send via mailgun', async (t) => {
  const email = {
    subject: 'Hello',
    from: 'Dhi Aurrahman <diorahman@rockybars.com>',
    to: 'Dhi Aurrahman <diorahman@gmail.com>',
    body: 'Hello!'
  }

  const result = await EmailService.send(email, Sender.Service.MAILGUN)

  t.true(result.success)
  t.deepEqual(result.service, Sender.Service.MAILGUN)
})
