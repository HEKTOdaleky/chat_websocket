import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Chat from "./containers/Chat/Chat";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/chat" exact component={Chat}/>
                <Route path="/register" exact component={Register}/>
                <Route render={() => <h1 style={{textAlign: 'center'}}>Page not found</h1>}/>
            </Switch>
        </BrowserRouter>
    );
};

export default App;
