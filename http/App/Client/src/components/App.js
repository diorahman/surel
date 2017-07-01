import { h, Component } from 'preact'
import { Router } from 'preact-router'
import Home from './Home'
import Email from './Email'
import Error from './Error'

export class App extends Component {
  render () {
    return (
      <div class="app">
        <Router>
          <Home path="/" />
          <Email path="/email/:id" />
          <Error default />
        </Router>
      </div>
    )
  }
}

export default App
