import axios from "axios";

export const endpoint = axios.create({
  baseURL: "/api",
});
