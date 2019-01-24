import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from '../src/components/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Switch, Route, withRouter}from "react-router-dom"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login"
import firebase from "./firebase";
import Spinner from "./Spinner";
//Redux
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer"
import { setUser, clearUser } from "./actions"

const store = createStore(rootReducer, composeWithDevTools());


class Root extends React.Component {
    componentDidMount(){
      firebase.auth().onAuthStateChanged(user => {
          if(user){
              //console.log(user);
              this.props.setUser(user);
            this.props.history.push("/")
          }else{
              this.props.history.push("/login");
              this.props.clearUser();
          }
      })  
    }
render(){
    return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register} />
            </Switch>
        
        )
    }
}

const mapstateFromProps = state => ({
    isLoading: state.user.isLoading
});

const RootwithAuth = withRouter(
    connect(mapstateFromProps, { setUser, clearUser })(Root));

ReactDOM.render(
<Provider store={store}>
    <Router>
        <RootwithAuth />
    </Router>
</Provider>
,document.getElementById('root'));
registerServiceWorker();
