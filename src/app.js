import React, { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
// import BioEditor from "./bioediter";
import axios from "./axios";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
    }

    async componentDidMount() {
        const { data } = await axios.get("/user");
        console.log("data in app.js: ", data);
        this.setState(data);
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
                <header>
                    <nav className="logo">
                        <img src="./public/logo.png" />
                    </nav>
                    <nav className="nav-pic">
                        <ProfilePic
                            imageUrl={this.state.url}
                            toggleModal={() => this.toggleModal()}
                        />
                    </nav>
                </header>

                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    toggleModal={() => this.toggleModal()}
                    imageUrl={this.state.url}
                    bio={this.state.bio}
                    setBio={this.state.setBio}
                />

                {this.state.uploaderIsVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
