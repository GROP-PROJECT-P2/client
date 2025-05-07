import axios from "axios";

const https = axios.create({
  baseURL: "https://ad91-120-188-81-240.ngrok-free.app/",
  headers: { "ngrok-skip-browser-warning": "skip-browser-warning" },
  // baseURL: "http://localhost:3000/",
});

// Add request interceptor for debugging
https.interceptors.request.use(
  function (config) {
    // Log the request configuration
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default https;
