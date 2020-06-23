import React, { Component } from "react";
import { render } from "react-dom";
import axios from "./axios";

class ResetPassword extends Component {
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
        e.preventDefault();
        axios
            .post("/reset", this.state)
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
                    console.log("data in /reset: ");
                    
                    // location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("err in post reset: ", err));
    }

    getCurrentDisplay() {
        // const step = this.state.step;
        const step = 1;
        if (step == 1) {
            return (
                <div>
                    <h3>Reset Password</h3>
                    <p>
                        Please enter the email address with which you registered
                    </p>
                    {this.state.error && (
                        <div>Opps, something went wrong...</div>
                    )}
                    <input
                        className="inputField"
                        name="email"
                        placeholder="email"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <button onClick={(e) => this.submit(e)}>Submit</button>
                </div>
            );
        } else if (step == 2) {
            return <div>shows 2nd display</div>;
        } else {
            // show something else
        }
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default ResetPassword;
