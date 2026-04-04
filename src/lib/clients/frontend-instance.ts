import axios, { type AxiosInstance } from "axios";

export function createFrontendAxios(): AxiosInstance {
  return axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
  });
}
