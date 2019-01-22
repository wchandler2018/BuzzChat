import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from '../src/components/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Switch, Route, withRouter}from "react-router-dom"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login"
import firebase from "./firebase";

class Root extends React.Component {
    componentDidMount(){
      firebase.auth().onAuthStateChanged(user => {
          if(user){
            this.props.history.push("/")
          }
      })  
    }
render(){
    return(
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register} />
            </Switch>
        
        )
    }
}

const RootwithAuth = withRouter(Root);

ReactDOM.render(
<Router>
<RootwithAuth />
</Router>
, document.getElementById('root'));
registerServiceWorker();
