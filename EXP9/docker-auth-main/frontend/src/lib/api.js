import axios from "axios";

const runtimeBase =
  typeof window !== "undefined" && window.__APP_CONFIG__?.API_BASE_URL
    ? window.__APP_CONFIG__.API_BASE_URL
    : "/api";

const initialToken =
  typeof window !== "undefined" ? window.localStorage.getItem("token") || "" : "";

export const api = axios.create({
  baseURL: runtimeBase,
  timeout: 10000,
  headers: initialToken ? { Authorization: `Bearer ${initialToken}` } : {}
});

export function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
