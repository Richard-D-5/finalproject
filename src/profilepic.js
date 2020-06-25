import React from "react";

export default function ProfilePic(props) {
    console.log("props - info being passed down from parent: ", props);
    let imageUrl = props.imageUrl || "default.png";

    return (
        <div>
            <img
                className="profile-pic"
                src={imageUrl}
                alt={(props.first, props.last)}
                onClick={props.toggleModal}
            />
        </div>
    );
}
