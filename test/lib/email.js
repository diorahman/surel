require('dotenv').load()
const test = require('ava')
const Email = require('../../lib/email')

test('create', (t) => {
  const email1 = new Email('Test1', '<diorahman@rockybars.com>')
  const email2 = new Email('Test2', 'Dhi Aurrahman <diorahman@rockybars.com>')

  const obj1 = email1.toJSON()
  const obj2 = email2.toJSON()
  t.deepEqual(obj1.from, 'diorahman@rockybars.com')
  t.deepEqual(obj2.from, 'diorahman@rockybars.com')
  t.deepEqual(obj2.meta.from, {name: 'Dhi Aurrahman', address: 'diorahman@rockybars.com'})
})

test('compose', (t) => {
  const email = Email.compose('Test1', 'test@test.com')
    .to('Testers: "Ok, Test" <ok@test.com>, "Great, Test" <great@test.com>')
    .cc('test@test.com')
    .bcc('test@test.com')
    .set('Content-Type', 'text/plain')
    .write('OK!')

  const obj = email.toJSON()
  t.deepEqual(obj.from, 'test@test.com')
  t.deepEqual(obj.subject, 'Test1')
  t.deepEqual(obj.to, ['ok@test.com', 'great@test.com'])
  t.deepEqual(obj.cc, ['test@test.com'])
  t.deepEqual(obj.bcc, ['test@test.com'])
  t.deepEqual(obj['content-type'], 'text/plain')
  t.deepEqual(obj.body, 'OK!')
})
