import { PublicClientApplication, LogLevel, CryptoProvider, AuthenticationResult, SilentFlowRequest, AccountInfo, Configuration } from '@azure/msal-node';
import { BrowserWindow, protocol } from 'electron';
import path from 'path';
import url from 'url';
import config from '../../renderer/utils/application.config.release'
import dayjs from 'dayjs';
import { cachePlugin } from "./CachePlugin";
import AuthProvider from './AuthProvider';

/**
 * To demonstrate best security practices, this Electron sample application makes use of
 * a custom file protocol instead of a regular web (https://) redirect URI in order to
 * handle the redirection step of the authorization flow, as suggested in the OAuth2.0 specification for Native Apps.
 */
const CUSTOM_FILE_PROTOCOL_NAME = config.REDIRECT_URI.split(':')[0];

class SPAuthProvider {

    msalAuthProvider: AuthProvider;

    constructor(authProvider: AuthProvider) {
        /**
         * Initialize a public client application. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
         */
        this.msalAuthProvider = authProvider;
    }

    async login(authWindow: BrowserWindow) {
      let authUrl = "https://fresenius.sharepoint.com/teams/FMETS0269990/Shared%20Documents/Forms/AllItems.aspx"
      authWindow.webContents.session.allowNTLMCredentialsForDomains('fresenius.sharepoint.com *fresenius.com')

      const success = await this.listenForSuccessfulAuthRedirect(authUrl, authWindow);

      if (success) {
        return this.msalAuthProvider.login(authWindow)
      }
      return null
    }

    async logout(authWindow: BrowserWindow) {
      await this.msalAuthProvider.logout()

      let logoutUrl = 'https://fresenius.sharepoint.com/teams/FMETS0269990/_layouts/15/SignOut.aspx?ru=https%3a%2f%2ffresenius.sharepoint.com%2fteams%2fFMETS0269990&signoutoidc=1#'
      await this.listenForSuccessfulLogoutRedirect(logoutUrl, authWindow)
    }

    async listenForSuccessfulAuthRedirect(navigateUrl:any, authWindow: BrowserWindow) {

      authWindow.loadURL(navigateUrl);

      return new Promise((resolve, reject) => {
          authWindow.webContents.on('will-redirect', (event:any, responseUrl:any) => {
              try {
                  if (responseUrl == navigateUrl) {
                        event.preventDefault()
                        resolve(true)
                  }
              } catch (err) {
                  reject(err);
              }
          });
      });
  }

  async listenForSuccessfulLogoutRedirect(navigateUrl:any, authWindow: BrowserWindow) {

    authWindow.loadURL(navigateUrl);

    return new Promise((resolve, reject) => {
        authWindow.webContents.on('will-redirect', (event:any, responseUrl:any) => {
            try {
                if (responseUrl == navigateUrl) {
                      event.preventDefault()
                      resolve(true)
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}
async getTokenSilent(currentAccount: AccountInfo | null | undefined): Promise<AuthenticationResult | null> {
  return this.msalAuthProvider.getTokenSilent(currentAccount);
}
}

export default SPAuthProvider;
