import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioediter";

export default function Profile(props) {
    console.log("props in profile.js: ", props);
    return (
        <div>
            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                toggleModal={props.toggleModal}
            />
            <BioEditor bio={props.bio} changeBio={props.changeBio} />
        </div>
    );
}
