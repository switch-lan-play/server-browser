import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { Index } from './pages/Index'

export const App: React.FC = () => {
  return <>
    <Router>
      <Switch>
        <Route path='/' component={Index} />
      </Switch>
    </Router>
  </>
}

export default App
