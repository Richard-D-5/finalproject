import React, { useEffect, useState } from "react";
import axios from "./axios";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";
import { useDispatch, useSelector } from "react-redux";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    const acceptedFriends =
        useSelector(
            (state) =>
                state.friendsWannabes &&
                state.friendsWannabes.filter((friends) => friends.accepted)
        ) || [];

    console.log("acceptedFriends: ", acceptedFriends);

    return (
        <div className="friends-container">
            <p>I am the friend component!!!</p>
        </div>
    );
}
