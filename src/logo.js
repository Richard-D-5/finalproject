import React from "react";

export default function Logo() {
    let image = "logo.png";
    return (
        <div className="logo">
            <img src={image} />
        </div>
    );
}
