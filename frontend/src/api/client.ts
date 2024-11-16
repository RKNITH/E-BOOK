import axios from "axios";

let baseURL = "https://clownfish-app-8rn5a.ondigitalocean.app";
if (import.meta.env.MODE === "development") {
  baseURL = "http://localhost:8989";
}

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(function (config) {
  config.withCredentials = true;

  return config;
});

export default client;
