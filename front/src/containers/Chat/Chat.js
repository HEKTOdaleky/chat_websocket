import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem} from "react-bootstrap";
import { logoutUser } from "../../store/actions/user";
import config from '../../config.js';

class Chat extends Component {

  state = {
    messageText: ""
  };

  wsConnect = () => {
      this.websocket = new WebSocket(
        `${config.wsUrl}?token=${this.props.user.user.token}`
      );

      this.websocket.onopen = event => {
        console.log('"WS connection is open:________',event.target.url);
      };

      this.websocket.onmessage = message => {
        const decodedMessage = JSON.parse(message.data);
        this.props.toReducer(decodedMessage);
      };

      this.websocket.onclose = event => {
        console.log('WS connection was closed! Error code:________', event.code);
        setTimeout(() => this.checkConnect(), 5000);
    };
  };

  checkConnect = () => {
    this.props.user && this.wsConnect();
  };

  componentDidMount() {
    try {
      if (!this.websocket) this.wsConnect();
    } catch (e) {
        this.props.history.push("/");
    }
  }

  componentDidUpdate() {
    if (!this.props.user) {
      this.websocket.close();
    }
  }

  removeMessage = (event, id) => {
    event.preventDefault();

    this.websocket.send(
      JSON.stringify({
        type: "DELETE_MESSAGE",
        id
      })
    );
  };

  messageNameChangeHandler = event => {
    this.setState({ messageText: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    this.websocket.send(
      JSON.stringify({
        type: "CREATE_MESSAGE",
        text: this.state.messageText
      })
    );

    this.setState({ messageText: "" });
  };

  render() {
    return (
      <div style={{ width: "70%", margin: "0 auto", }}>
        <div style={{ float: "right", paddingLeft: "20px" }}>
          <h3>Users</h3>
          {this.props.users &&
            this.props.users.map(user => (
              <p key={user.username}>
                <b>{user.username}</b>
              </p>
            ))}
          <p>
            <Button
              onClick={this.props.logoutUser}
              bsStyle="primary"
              bsSize="small"
            >
              Log Out
            </Button>
          </p>
        </div>

        <div style={{ height: "500px", overflow: "auto" }}>
          <h3 style={{ position: "absolute", top: "5px", left: "20px" }}>
            Messages
          </h3>
          <ListGroup
            style={{ border: "1px solid black", width: "100%", float: "left" }}
          >
            {this.props.messages &&
              this.props.messages.map(message => (
                <ListGroupItem key={message._id}>
                  <h4>
                    <strong>{message.user.username}</strong>: {message.text} <small>at {message.date}</small>
                  </h4>
                  {this.props.user &&
                  this.props.user.user.role === "moderator" ? (
                    <Button onClick={event => this.removeMessage(event, message._id)}>
                      Remove
                    </Button>
                  ) : null}
                </ListGroupItem>
              ))}
          </ListGroup>
        </div>
        <div style={{ width: "70%", float: "left" }}>
          <form onSubmit={this.sendMessage}>
            <FormGroup controlId="formControlsTextarea">
              <FormLabel>New Message</FormLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Enter Message"
                value={this.state.messageText}
                onChange={this.messageNameChangeHandler}
              />
            </FormGroup>
            <Button type="submit">Send Message</Button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.users.user,
    messages: state.chat.messages,
    users: state.chat.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toReducer: dispatch,
    logoutUser: () => {
      return dispatch(logoutUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
