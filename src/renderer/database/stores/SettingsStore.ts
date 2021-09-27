import { db } from "../database";
import { localStorgeHelper } from "../storage";
import { AbstractStore } from "./AbstractStore";

class SettingsStore extends AbstractStore {

  lastUpdate:string = ""
  currentCountry?: string
  currentVersion?: string
  allAvailableCountries = Array<string>() 

  async update() {
    this.lastUpdate = localStorgeHelper.getLastModifiedDate() ?? ""
    let user = await db.getUser()

    if(user) {
      this.currentCountry = user?.country 
      this.currentVersion = user?.version
    }

    this.allAvailableCountries = await db.getAllAvailableCountries() ?? []
  }
}