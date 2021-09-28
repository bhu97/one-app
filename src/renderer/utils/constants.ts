export const ipcEvent = {
  login: "LOGIN",
  getToken: "GET_TOKEN",
  refreshToken: "REFRESH_TOKEN",
  whitelists: "GET_WHITELISTS"
}

export interface ILoginState {
  login: LoginState
  token: TokenState
}

export interface IAppState {
  login: LoginState
  token: TokenState
  metadata: MetaDataState
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

export const AppState: IAppState = {
  login: LoginState.LOGGED_OUT,
  token: TokenState.INVALID_TOKEN,
  metadata: MetaDataState.NO_METADATA,
}

export const fileSizeMax = 20971520