import { h, Component } from 'preact';

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
      isValid: false
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
    const {from, to, subject, body} = this.state

    fetch('/v1/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({from, to, subject, body})
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }

  checkValidity () {
    const {from, to, subject, body} = this.state
    this.setState({
      isValid: from.length > 0 && to.length > 0 && subject.length > 0 && body.length > 0
    })
  }

  render({}, {from, to, subject, fromIsValid, toIsValid, subjectIsValid, isValid}) {
    return (
      <div>
        <p>Or, compose an email</p>
        <form onSubmit={(event) => this.onSubmit(event)}>
          <input type="text" className={fromIsValid ? '' : 'invalid'} onInput={(event) => this.onFromChange(event)} placeholder="from, e.g. diorahman@gmail.com" />
          <br />
          <input type="text" className={toIsValid ? '' : 'invalid'} onInput={(event) => this.onToChange(event)} placeholder="to, e.g. diorahman@gmail.com, dio@hooq.tv" />
          <input type="text" className={subjectIsValid ? '' : 'invalid'} onInput={(event) => this.onSubjectChange(event)} placeholder="e.g. Hello! This is me" />
          <textarea onInput={event => this.onBodyChange(event)} placeholder="e.g. Lorem ipsum, <b>OK!</b>" />
          <br />
          <input type="submit" disabled={!isValid} value="Send" />
        </form>
      </div>
    )
  }
}

export default Composer
