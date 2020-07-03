import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    console.log("props.id in friendbutton: ", props.id);
    const [buttonText, setButtonText] = useState("");
    console.log("buttonText: ", buttonText);
    const buttonStatus = {
        make: "Make friend request",
        accept: "Accept friend request",
        end: "End friendship",
        cancel: "Cancel friend request",
    };
    const { id } = props;
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/friendship-status/${id}`);
                console.log("data in useEffect GET: ", data);
                setButtonText(data);
                if (data.length < 1) {
                    setButtonText(buttonStatus.make);
                } else if (data.accepted == false) {
                    setButtonText(buttonStatus.cancel);
                    console.log("Cancel button");
                }
            } catch (err) {
                console.log("err in useEffect in friendbutton: ", err);
            }
        })();
    }, [id]);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            console.log("I am in the try part.");
            const { data } = await axios.post(
                `/make-friend-request/${props.id}`
            );
            console.log("data in /make-friend-request POST: ", data);
        } catch (err) {
            console.log(err);
        }
    };

    return <button onClick={handleClick}>{buttonText}</button>;
}
