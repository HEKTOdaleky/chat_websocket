import {DELETE_MESSAGE, LAST_MESSAGES, LOGGED_IN_USERS, NEW_MESSAGE} from "../actions/actionTypes";

const initialState = {
  messages: [],
  users: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN_USERS:
      return {...state, users: action.users};
    case NEW_MESSAGE:
    return {...state, messages: [...state.messages, action.message]};
    case LAST_MESSAGES:
      return {...state, messages: action.messages};
    case DELETE_MESSAGE:
      const message = state.messages.filter(message => message._id !== action.id);
      return {...state, messages: message};
    default:
      return state;
  }
};

export default reducer;