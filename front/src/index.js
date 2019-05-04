import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store, {history} from "./store/configureStore";
import {ConnectedRouter} from 'react-router-redux';
import 'react-notifications/lib/notifications.css';

import './index.css';
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
