/* eslint-env jest */
require('dotenv').load()
const Email = require('../lib/email')

test('create email', () => {
  const email1 = new Email('Test1', '<diorahman@rockybars.com>')
  const email2 = new Email('Test2', 'Dhi Aurrahman <diorahman@rockybars.com>')

  const obj1 = email1.toJSON()
  const obj2 = email2.toJSON()
  expect(obj1.from).toEqual('diorahman@rockybars.com')
  expect(obj2.from).toEqual('diorahman@rockybars.com')
  expect(obj2.meta.from, {name: 'Dhi Aurrahman', address: 'diorahman@rockybars.com'})
})

test('compose email', () => {
  const email = Email.compose('Test1', 'test@test.com')
    .to('Testers: "Ok, Test" <ok@test.com>, "Great, Test" <great@test.com>')
    .cc('test@test.com')
    .bcc('test@test.com')
    .set('Content-Type', 'text/plain')
    .write('OK!')

  const obj = email.toJSON()
  expect(obj.from).toEqual('test@test.com')
  expect(obj.subject).toEqual('Test1')
  expect(obj.to).toEqual(['ok@test.com', 'great@test.com'])
  expect(obj.cc).toEqual(['test@test.com'])
  expect(obj.bcc).toEqual(['test@test.com'])
  expect(obj['content-type'], 'text/plain')
  expect(obj.body, 'OK!')
})
