import React, { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("UPLOADER COMPONENENT");
    }

    methodInUploader() {
        // console.log("running mehtod in uploader");
        this.props.methodInApp("whoaaa");
    }

    render() {
        return (
            <div>
                <h2>This is my uploader component.</h2>

                <h2 onClick={() => this.methodInUploader()}>
                    Click here to run method in uploader!
                </h2>
            </div>
        );
    }
}
