export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        console.log("action: ", action.friendsWannabes);
        const user = { ...state.user };
        return { ...state, user };
    }
    return state;
}
