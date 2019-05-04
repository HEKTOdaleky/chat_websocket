import {
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT_SUCCESS, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS
} from "./actionTypes";
import { push } from "react-router-redux";
import axios from "../../axios-api";
import { NotificationManager } from "react-notifications";

const loginUserSuccess = (user, token) => {
  return { type: LOGIN_USER_SUCCESS, user, token };
};

const loginUserFailure = error => {
  return { type: LOGIN_USER_FAILURE, error };
};

export const loginUser = userData => {
  return dispatch => {
    return axios.post("/users/sessions", userData).then(
      response => {
        dispatch(loginUserSuccess(response.data, response.data.token));
        dispatch(push("/chat"));
      },
      error => {
        const errorObject = error.response
          ? error.response.data
          : { error: "Not Internet" };
        dispatch(loginUserFailure(errorObject));
        NotificationManager.error("Error", "Error", 3000);
      }
    );
  };
};

const registerUserSuccess = () => {
  return { type: REGISTER_USER_SUCCESS };
};

const registerUserFailure = error => {
  return { type: REGISTER_USER_FAILURE, error };
};

export const registerUser = userData => {
  return dispatch => {
    axios.post("/users", userData).then(
      response => {
        dispatch(registerUserSuccess());
        dispatch(push("/"));
        NotificationManager.success('Registration Successful', 'Success', 3000);
      },
      error => {
        dispatch(registerUserFailure(error.response.data));
      }
    );
  };
};


export const logoutUser = () => {
  return dispatch => {
    axios.delete("users/sessions").then(
      response => {
        dispatch({ type: LOGOUT_SUCCESS });
        dispatch(push("/"));
        NotificationManager.success("Logout Successful", "Success", 3000);
      },
      error => {
        NotificationManager.error("Error", "Error", 3000);
      }
    );
  };
};

