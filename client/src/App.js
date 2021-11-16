import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Fib from './Fib'

function App() {
  return (
    <Router>
      <Link to='/fib'>fib</Link>


      <Switch>
        <Route path='/fib'>
          <Fib />
        </Route>

      </Switch>

    </Router>
  );
}

export default App;
