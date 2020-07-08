import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);
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
    }, [chatMessages]);

    const keyCheck = (e) => {
        console.log("value: ", e.target.value);
        console.log("key pressed: ", e.key);

        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat-main-container">
            <p>Welcome to Chat</p>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((message) => {
                        return (
                            <div className="message-container" key={message.id}>
                                <div className="message-pic">
                                    <img
                                        className="profile-pic"
                                        alt={`${message.first} ${message.last}`}
                                        src={message.url}
                                    />
                                </div>
                                <div className="message">
                                    <p>
                                        {message.first} {message.last}
                                    </p>
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
