import { h, Component } from 'preact'

export class Receipt extends Component {
  constructor (props) {
    super(props)
  }

  render(props, {}) {
    return (
      <div>
      <pre>
        { JSON.stringify(JSON.parse(atob(this.props.id)), null, 2) }
      </pre>

      <a href="/">Home</a>
      </div>
    )
  }
}

export default Receipt

