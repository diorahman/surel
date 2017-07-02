import { h, Component } from 'preact'
import { route } from 'preact-router'

export class Composer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      subject: '',
      to: '',
      from: '',
      body: '',

      fromIsValid: true,
      toIsValid: true,
      subjectIsValid: true,
      isValid: true,

      sending: false,
      service: 'mandrill',
      fallback: false
    }
  }

  onFromChange (event) {
    this.setState({
      from: event.target.value,
      fromIsValid: true
    })
    this.checkValidity()
  }

  onToChange (event) {
    this.setState({to: event.target.value})
    this.checkValidity()
  }

  onSubjectChange (event) {
    this.setState({subject: event.target.value, subjectIsValid: true})
    this.checkValidity()
  }

  onBodyChange (event) {
    this.setState({body: event.target.value})
    this.checkValidity()
  }

  onSubmit (event) {
    event.preventDefault()
    const {from, to, subject, body, service, fallback} = this.state

    this.setState({sending: true})

    fetch('/v1/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({from, to, subject, body, service, fallback})
    })
    .then(res => res.json())
    .then(data => {
      route(`/receipt/${btoa(JSON.stringify(data))}`)
      this.setState({ sending: false })
    })
  }

  checkValidity () {
    const {from, to, subject, body} = this.state
    this.setState({
      isValid: from.length > 0 && to.length > 0 && subject.length > 0 && body.length > 0
    })
  }

  render({}, {from, to, subject, body, sending, fromIsValid, toIsValid, subjectIsValid, isValid, fallback, service}) {
    return (
      <div>
        <p>Or, compose an email</p>
        <form onSubmit={(event) => this.onSubmit(event)}>
          <input type="text" disabled={sending} value={from} className={fromIsValid ? '' : 'invalid'} onInput={(event) => this.onFromChange(event)} placeholder="from, e.g. diorahman@gmail.com" />
          <input type="text" disabled={sending} value={to} className={toIsValid ? '' : 'invalid'} onInput={(event) => this.onToChange(event)} placeholder="to, e.g. diorahman@gmail.com, dio@hooq.tv" />
          <input type="text" disabled={sending} value={subject} className={subjectIsValid ? '' : 'invalid'} onInput={(event) => this.onSubjectChange(event)} placeholder="e.g. Hello! This is me" />
          <textarea value={body} disabled={sending} onInput={event => this.onBodyChange(event)} placeholder="e.g. Lorem ipsum, <b>OK!</b>" />
          <select value={service} onChange={event => { this.setState({service: event.target.value}) }}>
            <option value="mandrill">Mandrill</option>
            <option value="sendgrid">Sendgrid</option>
            <option value="mailgun">Mailgun</option>
          </select>
          <select value={fallback ? 'fallback' : 'none'} onChange={event => { this.setState({fallback: event.target.value === 'fallback'}) } }>
            <option value="none">None</option>
            <option value="fallback">Fallback</option>
          </select>
          <input type="submit" disabled={!isValid || sending} value="Send" />
      </form>
      </div>
    )
  }
}

export default Composer
