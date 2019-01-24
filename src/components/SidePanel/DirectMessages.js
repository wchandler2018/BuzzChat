import React from "react"
import { Menu, Icon } from "semantic-ui-react"

class DirectMessages extends React.Component{
    state={
        users: []
    }
    render(){
        const { users } = this.state
        return(
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                       <Icon name="mail"/> DIRECT MESSAGE
                    </span>{" "}
                    ({users.length})
                </Menu.Item>
                {/* Users to send direct Messages */}
            </Menu.Menu>
        )
    }
}

export default DirectMessages