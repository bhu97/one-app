import { db, IDriveItem } from "renderer/database/database";
import { AbstractStore } from "./AbstractStore";


export class FavoriteStore extends AbstractStore {

  async update() {
    const favoriteGroupName = this.params.query
    if(favoriteGroupName) {
      let allItems:IDriveItem[] = []
      allItems = await db.favoritesForFavoriteGroup(favoriteGroupName)
      this.items = allItems
    }
  }

  async addFavoriteGroup(name: string) {
    await db.addFavoriteGroup(name)
  }

  async removeFavoriteGroup(name: string) {
    await db.removeFavoriteGroup(name)
  }

  async getAllFavoriteGroupNames() {
    return await db.getAllFavoriteGroupNames()
  }

  async getFavoriteGroupsForItem (uniqueId: string) {
    return await db.getFavoriteGroupsForItem(uniqueId)
  }
  async removeFavoriteFromGroup(uniqueId:string, favoriteGroupName: string) {
    await db.removeFavorite(uniqueId, favoriteGroupName) 
  }
}