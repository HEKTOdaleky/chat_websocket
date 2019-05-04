import { routerMiddleware, routerReducer } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { createBrowserHistory as createHistory } from 'history'
import { applyMiddleware, combineReducers, compose, createStore } from "redux";

import { readState, saveState } from "./localStorage";

import usersReducer from "./reducers/user";
import chatReducer from "./reducers/chat";



const rootReducer = combineReducers({
    chat: chatReducer,
    users: usersReducer,
    routing: routerReducer
});

export const history = createHistory();

const middleware = [
  thunkMiddleware,
  routerMiddleware(history)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const persistedState = readState();

const store = createStore(rootReducer, persistedState, enhancer);

store.subscribe(() => {
  saveState({users: {user: store.getState().users.user}});
});

export default store;