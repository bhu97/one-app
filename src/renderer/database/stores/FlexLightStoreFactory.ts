import { CountryVersion, db } from "renderer/database/database"
import { IStore, IStoreParams } from "./AbstractStore"
import { ContentStore } from "./ContentStore"
import { FlexStore } from "./FlexStore"
import { LightStore } from "./LightStore"

/**
 * Get a light/flex store for the current country version
 * @param {IStoreParams} params - the params have a query field, pass a uniqueId for a folder to get its contents
 */
const getStoreForCurrentUser = async(params?: IStoreParams): Promise<IStore | undefined> => {
  //get the selected country and version for current user
  let user = await db.getUser()

  if(user) {
    //if the version is empty, we have an error
    if(user.version == "") {
      return undefined
    }

    if(params?.query) {
      let item = await db.getItemForId(params.query)
      console.log("ITEMS", item)
      if(item.contentType && item.contentType == "Document Set") {
        return new ContentStore(params ?? {})
      }
    }

    const version = parseInt(user.version)
    //return flex or light store
    if(version == CountryVersion.flex) {
      console.log("Loading flex store")
      return new FlexStore(params ?? {})
    }

    if(CountryVersion.light) {
      console.log("Loading light store")
      return new LightStore(params ?? {})
    }

  }
  //no existing user is also an error
  return undefined
}

export const FlexLightStoreFactory = {
  getStoreForCurrentUser: getStoreForCurrentUser
}
