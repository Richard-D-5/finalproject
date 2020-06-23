import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.stat: ", this.state)
        );
    }

    submit(e) {
        console.log("about to submit!!!");
        // e.preventDefault();
        axios
            .post("/register", this.state)
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("err in post register: ", err));
    }

    render() {
        return (
            <>
                <h1>I am Registration </h1>
                {this.state.error && <div>Opps, something went wrong...</div>}
                <input
                    className="inputField"
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <input
                    className="inputField"
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <input
                    className="inputField"
                    name="email"
                    placeholder="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <input
                    className="inputField"
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <button onClick={() => this.submit()}>Register</button>

                <Link to="/login">Login</Link>
            </>
        );
    }
}

export default Registration;
