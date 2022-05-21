import BaseResource from "../resources/base_resource.js"
import Storage from "../../resources/storage.js"
import { scaleX, scaleY } from "/helpers.js"

export default class Workshop extends BaseResource {
  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)

    this.craft_ratio = 10
    this.connected_storage = Storage.nearest(this.sprite.x, this.sprite.y)
  }
}
