import axios from "axios";

const https = axios.create({
  //   baseURL: " https://9c39-120-188-73-134.ngrok-free.app/",
  //   headers: { "ngrok-skip-browser-warning": "skip-browser-warning" },
  baseURL: "http://localhost:3000/",
});

export default https;
