import React from "react";
import ReactDOM from "react-dom";
// import { Discovery } from "aws-sdk";
import Welcome from "./welcome";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    elem = <h1>I will be the main social network app!</h1>;
}

ReactDOM.render(elem, document.querySelector("main"));
