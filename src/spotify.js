import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function SpotifyRequest() {
    const [artist, setUsers] = useState("");
    // const [newUsers, setNewUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/users/${users || "+"}`);
            console.log("data in axios findpeople: ", data);
            setNewUsers(data);
        })();
    }, [users]);
}
