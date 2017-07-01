const {Service} = require('./sender')

exports.next = function (current) {
  switch (current) {
    case Service.SENDGRID: return Service.MAILGUN
    case Service.MAILGUN: return Service.MANDRILL
    case Service.MANDRILL: return Service.SENDGRID
    default: return Service.SENDGRID
  }
}
