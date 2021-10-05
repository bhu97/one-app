import {AuthenticationResult, AccountInfo } from '@azure/msal-node';
import { BrowserWindow, Cookie, CookiesGetFilter, Session} from 'electron';
import config from '../../renderer/utils/application.config.release'
import AuthProvider from './AuthProvider';

class SPAuthProvider {

    msalAuthProvider: AuthProvider;
    interactiveHosts: string[] = config.INTERACTIVE_LOGIN_HOSTS

    constructor(authProvider: AuthProvider) {
        /**
         * Initialize a public client application. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
         */
        this.msalAuthProvider = authProvider;
    }

    async login(authWindow: BrowserWindow) {
      let authUrl = config.ROOT_WEB_URL
      // authWindow.webContents.session.cookies.addListener("changed", (event, cookie, cause, removed) => {
      //     if (cookie.name == "FedAuth" || cookie.name == "rtFa") {
      //       console.log(`Got Cookie: ${cookie.name}`)
      //       console.log(`Cookie "${cookie.name}" changed: ${cause}: ${JSON.stringify(cookie)}`)
      //     }
      // })
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

    isURLInteractive(urlString: string): boolean {
      let url = new URL(urlString)
      let host = url.host

      const isInteractive = this.interactiveHosts.includes(host)
      return isInteractive
    }

    async listenForSuccessfulRedirectBack(navigateUrl:any, authWindow: BrowserWindow) {
      authWindow.loadURL(navigateUrl)
      authWindow.hide()

      return new Promise((resolve, reject) => {
        authWindow.webContents.on('did-start-navigation', (_event: Electron.Event, url: string) => {
          if (!authWindow.isVisible()) {
            if (this.isURLInteractive(url)) {
              authWindow.show()
            }
          }
        })
        authWindow.webContents.on('did-redirect-navigation', (event:any, responseUrl:any) => {
          try {
            if (responseUrl.startsWith(navigateUrl)) {
              authWindow.hide()
              event.preventDefault()
              authWindow.removeAllListeners()
              resolve(true)
            } else {
              if (!authWindow.isVisible() && this.isURLInteractive(responseUrl)) {
                authWindow.show()
              }
            }
          } catch (err) {
            authWindow.removeAllListeners()
            reject(err)
          }
        });
        authWindow.webContents.on('did-stop-loading', (event: any) => {
          if (event.sender.getURL().startsWith(navigateUrl)) {
            event.preventDefault()
            authWindow.removeAllListeners()
            resolve(true)
          }
        })
      });
    }
    async getTokenSilent(currentAccount: AccountInfo | null | undefined): Promise<AuthenticationResult | null> {
        return this.msalAuthProvider.getTokenSilent(currentAccount);
    }

    async isSessionAuthenticated(session: Session | undefined): Promise<Boolean>{
      if (session) {
        const fedAuthValid = await this.checkCookieExpiration(session, "FedAuth")
        const rtfaValid = await this.checkCookieExpiration(session, "rtFa")

        return fedAuthValid && rtfaValid
      }
      else {
        return false
      }
    }

    private async checkCookieExpiration(session: Session, name: string) : Promise<Boolean>{
      return new Promise<Boolean>((resolve, _reject) => {
        this.getCookie(session, {
          name: name
        }).then(cookie => {
          if (cookie.expirationDate) {
            const now = new Date()
            const expirationDate = new Date(cookie.expirationDate * 1000) //convert Unix epoch (seconds) to JS getTime (milliseconds)
            if (now < expirationDate) {
              resolve(true)
              return
            }
          }
          resolve(false) //Default fallthrough
        }).catch(() => {
          resolve(false)
        })
      })
    }

    private async getCookie(session: Session, filter: CookiesGetFilter): Promise<Cookie> {
      return new Promise<Cookie>(async (resolve, reject) => {
        let cookies = await session.cookies.get(filter)

        if (cookies.length != 1) {
          reject()
        } else {
          resolve(cookies[0])
        }
      })
    }
}

export default SPAuthProvider;
