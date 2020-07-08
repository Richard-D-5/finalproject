import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);
    // const chatMessage = useSelector((state) => state && state.msg);
    console.log("here ar my last 10 chat messages: ", chatMessages);
    // console.log("my message: ", chatMessage);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
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
                    chatMessages.map((message, idx) => {
                        return (
                            <div className="message-container" key={idx}>
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
