export const ipcEvent = {
  login: "LOGIN",
  getToken: "GET_TOKEN",
  refreshToken: "REFRESH_TOKEN",
  whitelists: "GET_WHITELISTS",
  loginSP: "LOGIN_SP",
}

export enum AppState {
  LOGGED_IN,
  NO_DATA,
  HAS_UPDATES
}

export const fileSizeMax = 20971520