import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react"

class Channels extends React.Component{
    state={
        activeChannel: "",
        user: this.props.currentUser,
        channels: [],
        channelName: "",
        channelDetails: "",
        channelsRef: firebase.database().ref("channels"),
        modal: false,
        firstLoad: true
    }

    componentDidMount(){
      this.addListeners();  
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    addListeners = () => {
       let loadedChannels = [];
       this.state.channelsRef.on("child_added", snap => {
        loadedChannels.push(snap.val());
        this.setState({ channels: loadedChannels }, () => this.setFirstChannel()); 
       });
    };

    removeListeners = () => {
      this.state.channelsRef.off() 
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0){
          this.props.setCurrentChannel(firstChannel); 
          this.setActiveChannel(firstChannel); 
        }
        this.setState({ firstLoad: false })
    }

    addChannel = () => {
        const {channelsRef, channelName, channelDetails, user} = this.state
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };
        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
               this.setState({ channelName: "", channelDetails: "" }) 
               this.closeModal();
               console.log("channel added")
            })
                .catch(err => {
                    console.log(err)
                })
    }

   handleSubmit = e => {
       e.preventDefault();
       if(this.isFormValid(this.state)){
           this.addChannel()
       }
   }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = channel => {
        this.setState({  activeChannel: channel.id})
    }

    displayChannels = channels => (
       channels.length > 0  && channels.map(channel => (
           <Menu.Item 
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.8 }}
            active={ channel.id === this.state.activeChannel}
           >
            # { channel.name }
           </Menu.Item>
       ))
    )

   isFormValid = ({ channelName, channelDetails}) => channelName && channelDetails;

    openModal = () => this.setState({
        modal: true
    })
    closeModal = () => this.setState({
        modal: false
    })

    render(){
        const { channels, modal } = this.state;
        return(
            <React.Fragment>
            <Menu.Menu className="menu">
                <Menu.Item>
                   <span>
                      <Icon name="exchange"/> CHANNELS
                    </span> {" "}
                    ({channels.length})<Icon name="add" color="red" size="large" onClick={this.openModal}/>{" "}
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>
                    Add A Channel
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                           <Input 
                           fluid 
                           label="Name of Channel"
                           name="channelName"
                           onChange={this.handleChange}/> 
                        </Form.Field>
                        <Form.Field>
                           <Input 
                           fluid 
                           label="Subject of Channel"
                           name="channelDetails"
                           onChange={this.handleChange}/> 
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark"/> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal} >
                        <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel})(Channels)