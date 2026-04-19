import axios from "axios";

const axiosInstanceBack = axios.create({ baseURL: process.env.BACKEND_URL });
export { axiosInstanceBack };
