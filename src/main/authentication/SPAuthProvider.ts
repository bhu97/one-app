import {AuthenticationResult, AccountInfo } from '@azure/msal-node';
import { BrowserWindow } from 'electron';
import config from '../../renderer/utils/application.config.release'
import AuthProvider from './AuthProvider';

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
      let authUrl = config.ROOT_WEB_URL
      authWindow.webContents.session.cookies.addListener("changed", (event, cookie, cause, removed) => {
          if (cookie.name == "FedAuth" || cookie.name == "rtFa") {
            console.log(`Got Cookie: ${cookie.name}`)
            console.log(`Cookie "${cookie.name}" changed: ${cause}: ${JSON.stringify(cookie)}`)
          }
      })
      const success = await this.listenForSuccessfulRedirectBack(authUrl, authWindow);

      if (success) {
        return this.msalAuthProvider.login(authWindow)
      }
      return null
    }

    async logout(authWindow: BrowserWindow) {
      await this.msalAuthProvider.logout()

      let logoutUrl = config.ROOT_LOGOUT_URL
      await this.listenForSuccessfulRedirectBack(logoutUrl, authWindow)
    }

    async listenForSuccessfulRedirectBack(navigateUrl:any, authWindow: BrowserWindow) {

      authWindow.loadURL(navigateUrl);

      return new Promise((resolve, reject) => {
          authWindow.webContents.on('did-redirect-navigation', (event:any, responseUrl:any) => {
              try {
                  if (responseUrl.startsWith(navigateUrl)) {
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
