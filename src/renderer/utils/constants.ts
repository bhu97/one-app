export const ipcEvent = {
  login: "LOGIN",
  getToken: "GET_TOKEN",
  refreshToken: "REFRESH_TOKEN",
  whitelists: "GET_WHITELISTS",
  loginSP: "LOGIN_SP",
}

export interface ILoginState {
  login: LoginState
  token: TokenState
  session: SessionState
}

export interface IAppState {
  login: LoginState
  token: TokenState
  metadata: MetaDataState
  session: SessionState
}

export enum MetaDataState {
  VALID,
  NO_METADATA,
  HAS_UPDATES,
  ERROR
}

export enum LoginState {
  LOGGED_IN,
  LOGGED_OUT,
  ERROR
}

export enum TokenState {
  VALID_TOKEN,
  EXPIRED_TOKEN,
  INVALID_TOKEN,
  ERROR
}

export enum SessionState {
  SESSION_VALID,
  SESSION_INVALID,
  ERROR
}

export const AppState: IAppState = {
  login: LoginState.LOGGED_OUT,
  token: TokenState.INVALID_TOKEN,
  metadata: MetaDataState.NO_METADATA,
  session: SessionState.SESSION_INVALID
}

export const fileSizeMax = 20971520
