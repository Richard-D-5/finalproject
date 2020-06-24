import React from "react";

export default function Presentational({ first, last, imageUrl }) {
    // console.log("props - info being passed down from parent: ", props);
    imageUrl = imageUrl || "default.png";

    return (
        <div>
            <h2>
                This is the Presentational component and my name is {first} and
                my last name is {last}.
            </h2>
            <img src={imageUrl} />
        </div>
    );
}
