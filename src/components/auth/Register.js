import React from "react";
import { Grid, Form, Segment, Header, Message, Icon, Button  } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";


class Register extends React.Component{
    constructor(props){
        super(props)
    this.state={
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [], 
        loading: false,
        usersRef: firebase.database().ref("users")
        }
    }

    //Ensure empty or invalid forms or not submitted to the database
    isFormValid = () => {
        let errors = [];
        let error;

       if(this.isFormEmpty(this.state)){
          //throw error 
            error = { message: "Please fill in all fields"};
            this.setState({ errors: errors.concat(error) })
            return false;
       }else if(!this.isPasswordValid(this.state)){
           //throw errow
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) })
            return false;
       }else{
           //form is valid
            return true;
       }
    }

    isFormEmpty = ({
      username, email, password, passwordConfirmation 
    }) => {
        return !username.length || !email.length || !password || !passwordConfirmation; 
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length < 8 || passwordConfirmation.length < 8 ){
        return false; 
        }else if(password !== passwordConfirmation){
        return false
        }else{
        return true;  
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
        if(this.isFormValid()){
        this.setState({ errors: [], loading: true });
       firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
           console.log(createdUser); 
           createdUser.user.updateProfile({
               displayName: this.state.username,
               photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
           })
           .then(() => {
            this.saveUser(createdUser).then(() => {
                console.log("user saved");
            })
           })
           .catch(err => {
            console.error(err);
            this.setState({ errors: this.state.errors.concat(err), 
            loading: false })
           })
        })
        .catch(err => {
            console.error(err)
            this.setState({ errors: this.state.errors.concat(err), 
            loading: false })
        });
    }
};

saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ""
}

   render(){
       const { username, email, password, passwordConfirmation, errors, loading } = this.state;
       return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450 }}>
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="rocketchat" color="orange" size="large"/>
                        Register for BuzzChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment>
                            <Form.Input fluid name="username" icon="user" iconPosition="left"
                            placeholder="Create a username" onChange={this.handleChange} type="text" value={username}
                            />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Enter an email address" onChange={this.handleChange} type="email" value={email}
                            className={this.handleInputError(errors, "email")}
                            />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Create a password" onChange={this.handleChange} type="password" value={password}
                            className={this.handleInputError(errors, "password")}
                            />
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                            placeholder="Confirm your password" onChange={this.handleChange} type="password" value={passwordConfirmation}
                            className={this.handleInputError(errors, "password")}
                            />
                            <Button disabled={loading} className={loading ? "loading" : ""}color="orange" fluid size="large">
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
                    <Message>Already a User? <Link to="/login"> Login</Link> </Message>
                </Grid.Column>
            </Grid>
       )
   } 
}

export default Register

