import axios from "axios";
import { loginInterface, RegisterInterface } from "../auth/Login";

export const login = (params: loginInterface) => {
  return axios.post("/authentication/login", params);
};

export const registerUser = (params: RegisterInterface) => {
  return axios.post("/authentication/register", params);
};

export const verifyEmailUrl = (params: any) => {
  return axios.post("/authentication/verify-email-url", params);
};
