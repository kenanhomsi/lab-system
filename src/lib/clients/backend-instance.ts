import axios, { type AxiosInstance } from "axios";

function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    return "http://localhost:4000";
  }
  return url.replace(/\/$/, "");
}

export function createBackendAxios(): AxiosInstance {
  return axios.create({
    baseURL: getBackendBaseUrl(),
    headers: { "Content-Type": "application/json" },
  });
}
