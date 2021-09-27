import { db } from "../database";
import { localStorgeHelper } from "../storage";
import { AbstractStore } from "./AbstractStore";
import config from './../../utils/application.config.release'

class SettingsStore extends AbstractStore {

  lastUpdate:string = ""
  currentCountry?: string
  currentVersion?: string
  allAvailableCountries = Array<string>() 
  appVersion: string = config.APP_VERSION

  async update() {
    this.lastUpdate = localStorgeHelper.getLastModifiedDate() ?? ""
    let user = await db.getUser()

    if(user) {
      this.currentCountry = user?.country 
      this.currentVersion = user?.version
    }

    this.allAvailableCountries = await db.getAllAvailableCountries() ?? []
  }

  async selectCountry(country: string) {
    await db.selectCurrentCountry(country)
    await this.update()
  }
}

export default SettingsStore