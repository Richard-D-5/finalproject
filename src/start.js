import React from "react";
import ReactDOM from "react-dom";
// import { Discovery } from "aws-sdk";
import Welcome from "./welcome";
import App from './app';

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
