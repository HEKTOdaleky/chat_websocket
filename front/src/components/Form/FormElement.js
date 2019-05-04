import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  FormLabel,
  FormControl,
  FormGroup
} from "react-bootstrap";
const FormElement = props => {

  let componentClass, formControlChildren;

  if (props.type === "textarea") {
    componentClass = "textarea";
  }

  if (props.type === "select") {
    componentClass = "select";

    props.options.unshift({
      id: '', name: 'select body'
    });

    formControlChildren = props.options.map((option, index) => (
      <option key={index} value={option.title}>{option.title}</option>
    ));
  }

  return (
    <FormGroup
      controlId={props.propertyName}
      validationState={props.error && "error"}
    >
      <Col componentClass={FormLabel} sm={3}>
        {props.title}
      </Col>
      <Col sm={9}>
        <FormControl
          type={props.type}
          componentClass={componentClass}
          required={props.required}
          placeholder={props.placeholder}
          name={props.propertyName}
          value={props.value}
          onChange={props.changeHandler}
          autoComplete={props.autoComplete}
        >
          {formControlChildren}
        </FormControl>
        {props.error && <div>{props.error}</div>}
      </Col>
    </FormGroup>
  );
};

FormElement.propTypes = {
  propertyName: PropTypes.string.isRequired,
  error: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeHandler: PropTypes.func.isRequired,
  autoComplete: PropTypes.string
};
export default FormElement;
