import React, { Component } from "react";
import Presentational from "./presentational";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Richard",
            last: "Dau",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        console.log("App mounted");
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log("I am running in App!!!");
        console.log("argument I passed to methodInApp: ", arg);
    }

    render() {
        return (
            <div>
                <h1>Hello from App.</h1>

                <Presentational
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />

                <h2 onClick={() => this.toggleModal()}>
                    Changing state with a method (toggleModal)
                </h2>

                {this.state.uploaderIsVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
