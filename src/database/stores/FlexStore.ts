import { db } from "database/database";
import { AbstractStore } from "./AbstractStore";

class FlexStore extends AbstractStore {
  async update() {
    const currentCountry = await db.getCurrentCountry()
  }
}