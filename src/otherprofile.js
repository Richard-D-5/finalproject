import React, { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        const { data } = await axios.get(`/user/${id}.json`);
        if (data.self) {
            this.props.history.push("/");
        } else {
            this.setState(data);
        }
    }

    render() {
        return (
            <div className="profile-container">
                <div className="pic-container">
                    <img
                        className="profile-pic"
                        alt={`${this.state.first} ${this.state.last}`}
                        src={this.state.url}
                    />
                </div>
                <div className="bio-container">
                    <h3>
                        {this.state.first} {this.state.last}
                    </h3>
                    <div className="bio-text">
                        <p>{this.state.bio}</p>
                    </div>
                </div>
            </div>
        );
    }
}
