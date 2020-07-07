import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();

    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("here ar my last 10 chat messages: ", chatMessages);

    useEffect(() => {
        console.log("chat hooks component has mounted");
        console.log("elementRef = ", elemRef);
        console.log("scroll Top: ", elemRef.current.scrollTop);
        console.log("clientHeight: ", elemRef.current.clientHeight);
        console.log("scrollHeight: ", elemRef.current.scrollHeight);

        // scroll
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        console.log("value: ", e.target.value);
        console.log("key pressed: ", e.key);

        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("our message: ", e.target.value);
            socket.emit("chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <p>Welcome to Chat</p>
            <div className="chat-messages-container" ref={elemRef}>
                <p>chat message will go here</p>
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
