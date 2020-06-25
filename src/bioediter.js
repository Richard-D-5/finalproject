import React, { Component } from "react";

export default class BioEditer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        console.log("e.target: ", e.target);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    render() {
        return (
            <div>
                <textarea
                    name="textarea"
                    rows="4"
                    cols="40"
                    placeholder="Please enter you bio here"
                    onChange={(e) => this.handleChange(e)}
                ></textarea>
            </div>
        );
    }
}
