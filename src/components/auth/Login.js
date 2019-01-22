import React from "react";
import { Grid, Form, Segment, Header, Message, Icon, Button  } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class Login extends React.Component{
    constructor(props){
        super(props)
    this.state={
        email: "",
        password: "",
        errors: [], 
        loading: false,
        }
    }

    //display error to users
    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    //handle changes to form fields
    handleChange = e => {
       this.setState({[e.target.name]: e.target.value}) 
    }
    //form submission 
    handleSubmit = e => {
        e.preventDefault();
        if(this.isFormValid(this.state)){
        this.setState({ errors: [], loading: true });
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
            console.log(signedInUser)
        })
        .catch(err => {
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              loading: false
            })
        })
    }
};

isFormValid = ({ email, password }) => email && password; 


handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ""
}

   render(){
       const { email, password,  errors, loading } = this.state;
       return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450 }}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="keyboard" color="violet" size="large"/>
                        Login to BuzzChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment>
                            
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Enter an email address" onChange={this.handleChange} type="email" value={email}
                            className={this.handleInputError(errors, "email")}
                            />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Create a password" onChange={this.handleChange} type="password" value={password}
                            className={this.handleInputError(errors, "password")}
                            />
                            
                            <Button disabled={loading} className={loading ? "loading" : ""}color="violet" fluid size="large">
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Don't have an account? <Link to="/register">Register</Link> </Message>
                </Grid.Column>
            </Grid>
       )
   } 
}

export default Login

