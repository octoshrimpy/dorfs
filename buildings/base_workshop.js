import BaseResource from "../resources/base_resource.js"
import Storage from "../resources/storage.js"

export default class BaseWorkshop extends BaseResource {
  static building = true

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)

    this.craft_ratio = 10
    this.connected_storage = Storage.nearest(this)
  }
}
