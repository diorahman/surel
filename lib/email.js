const parseAddress = require('addressparser')
const uuid = require('uuid').v4

class Email {
  constructor (subject, from, id) {
    this.id = id
    this.subject = subject
    this.from = this.parse(from)
    this.recipients = {}
    this.recipientMetas = {}
    this.data = {'content-type': 'text/plain'}
  }

  addRecipient (address, type = 'to') {
    if (!Array.isArray(this.recipients[type])) {
      this.recipients[type] = []
      this.recipientMetas[type] = []
    }
    const {parsed, meta} = this.parse(address)
    this.recipients[type] = this.recipients[type].concat(parsed)
    this.recipientMetas[type] = this.recipientMetas[type].concat(meta)
    return this
  }

  to (address) {
    return this.addRecipient(address, 'to')
  }

  cc (address) {
    return this.addRecipient(address, 'cc')
  }

  bcc (address) {
    return this.addRecipient(address, 'bcc')
  }

  attach (attachment) {
    if (!(this.attachments instanceof Set)) {
      this.attachments = []
    }
    this.attachments.push(attachment)
    return this
  }

  write (body) {
    this.body = body
    return this
  }

  set (prop, val) {
    this.data = this.data || {}
    this.data[prop.toLowerCase()] = val
    return this
  }

  parse (address) {
    const addresses = parseAddress(address)
    const parsed = []
    const meta = []
    addresses.forEach((item) => {
      if (item.group) {
        item.group.forEach((e) => {
          if (parsed.indexOf(e.address.toLowerCase()) < 0) {
            parsed.push(e.address)
            e.groupName = item.name
            meta.push(e)
          }
        })
      } else {
        if (parsed.indexOf(item.address.toLowerCase()) < 0) {
          parsed.push(item.address)
          meta.push(item)
        }
      }
    })
    return {parsed, meta}
  }

  toJSON () {
    return Object.assign({
      id: this.id,
      subject: this.subject,
      from: this.from.parsed.pop(),
      to: this.recipients.to || [],
      cc: this.recipients.cc || [],
      bcc: this.recipients.bcc || [],
      body: this.body,
      attachments: this.attachments,
      meta: {
        from: this.from.meta.pop(),
        recipients: this.recipientMetas
      }
    }, this.data || {})
  }
}

module.exports = exports = Email

exports.compose = function (subject, from, id = uuid()) {
  return new Email(subject, from, id)
}
