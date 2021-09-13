import { IDriveItem } from "database/database";
import { AbstractStore } from "./AbstractStore";


export class FavoriteStore extends AbstractStore {

  async update() {
    const favoriteGroupName = this.params.query
    if(favoriteGroupName) {
      let allItems:IDriveItem[] = []
      
    }
  }

}