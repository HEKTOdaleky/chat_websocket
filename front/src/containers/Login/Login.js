import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom'

import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup, Navbar, Row
} from "react-bootstrap";
import FormElement from "../../components/Form/FormElement";
import { loginUser } from "../../store/actions/user";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  inputChangeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitFormHandler = event => {
    event.preventDefault();

    this.props.loginUser(this.state);
  };

  render() {
    return (
      <div className="container">
        <Row className="show-grid">
          <Col md={4} mdOffset={4} >
           <Navbar>Login to chat</Navbar>
           <Form horizontal onSubmit={this.submitFormHandler}>
            {this.props.error && (
              <Alert bsStyle="danger">{this.props.error.message}</Alert>
            )}
            <FormElement
              propertyName="username"
              title="Username"
              type="text"
              value={this.state.username}
              changeHandler={this.inputChangeHandler}
              autoComplete="current-username"
            />

            <FormElement
              propertyName="password"
              title="Password"
              type="password"
              value={this.state.password}
              changeHandler={this.inputChangeHandler}
              autoComplete="current-password"
            />

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button bsStyle="primary" type="submit">
                  Login
                </Button>
                <NavLink to="/register" style={{float: 'right', marginRight: "20px", marginTop: '6px', fontWeight: '700'}}>Registration</NavLink>
              </Col>
            </FormGroup>
          </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.users.loginError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch(loginUser(userData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
