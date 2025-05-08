import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    auth: (cb) => {
        cb({
            token: localStorage.getItem("access_token")
        });
    }
});

export default socket;