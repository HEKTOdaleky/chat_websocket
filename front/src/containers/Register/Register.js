import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Navbar, Row
} from "react-bootstrap";
import { registerUser } from "../../store/actions/user";
import FormElement from "../../components/Form/FormElement";

class Register extends Component {
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

    this.props.onRegisterUser(this.state);
  };

  hasErrorForField = fieldName => {
    return this.props.error && this.props.error.errors[fieldName];
  };

  render() {
    return (
      <div className="container">
        <Row className="show-grid">
          <Col md={4} mdOffset={4}>
            <Navbar>Register new user</Navbar>
            <Form horizontal onSubmit={this.submitFormHandler}>

              <FormElement
                propertyName="username"
                title="Username"
                type="text"
                value={this.state.username}
                changeHandler={this.inputChangeHandler}
                autoComplete="new-username"
                error={this.hasErrorForField('username') && this.props.error.errors.username.message}
              />

              <FormElement
                propertyName="password"
                title="Password"
                type="password"
                value={this.state.password}
                changeHandler={this.inputChangeHandler}
                autoComplete="new-password"
                error={this.hasErrorForField('password') && this.props.error.errors.password.message}
              />

              <FormGroup>
                <Col smOffset={3} sm={9}>
                  <Button bsStyle="primary" type="submit">
                    Register
                  </Button>
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
    error: state.users.registerError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegisterUser: userData => dispatch(registerUser(userData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
