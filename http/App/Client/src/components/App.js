import { h, Component } from 'preact'
import { Router } from 'preact-router'
import Home from './Home'
import Receipt from './Receipt'
import Error from './Error'

export class App extends Component {
  render () {
    return (
      <div class="app">
        <Router>
          <Home path="/" />
          <Receipt path="/receipt/:id" />
          <Error default />
        </Router>
      </div>
    )
  }
}

export default App
