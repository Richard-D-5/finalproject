import React, { Component } from "react";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
// import BioEditor from "./bioediter";
import { BrowserRouter, Route, Link } from "react-router-dom";
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

    setBio(bio) {
        this.setState({
            bio: bio,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <header>
                        <Link className="logo" to="/">
                            <Logo />
                        </Link>
                        <Link className="find-people" to="/findusers">
                            Find People
                        </Link>
                        <Link to="/">
                            <nav className="nav-pic">
                                <ProfilePic
                                    imageUrl={this.state.url}
                                    toggleModal={() => this.toggleModal()}
                                />
                            </nav>
                        </Link>
                    </header>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                toggleModal={() => this.toggleModal()}
                                imageUrl={this.state.url}
                                bio={this.state.bio}
                                setBio={(bio) => this.setBio(bio)}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                id={props.id}
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/findusers"
                        render={() => (
                            <FindPeople
                                first={this.props.first}
                                last={this.props.last}
                                imageUrl={this.props.url}
                            />
                        )}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader methodInApp={this.methodInApp} />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
