import axios from "axios";

const axiosInstanceFront = axios.create({ baseURL: "/api" });
export { axiosInstanceFront };
