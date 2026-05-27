import axios from "axios";

const axiosInstanceBack = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:4000",
});
export { axiosInstanceBack };
