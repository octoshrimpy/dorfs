import BaseWorkshop from "./baseWorkshop.js"

export default class Bakery extends BaseWorkshop {
  static objs = []
  static craft_ratio = 75
  static item = {
    name: "bread",
    weight: 2
  }

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "buildings.bakery")
    this.ctx = ctx
    this.opts = opts || {}

    this.min_collect_factor = 0.1 // per sec
    this.max_collect_factor = 0.2
  }

  storageWheat() {
    return this.connected_storage.inventory.wheat?.count || 0
  }

  inspect() {
    return [
      this.constructor.name,
      "Resources: " + this.resources,
      "Storage Wheat: " + this.storageWheat()
    ]
  }

  tick() {
    // This is super hacky. Definitely not permanent.
    // Bakers should collect wheat and use that as the resource when collecting from here.
    this.resources = Math.floor(this.storageWheat() / this.constructor.craft_ratio)
  }

  collect() {
    if (this.storageWheat() > this.constructor.craft_ratio) {
      this.connected_storage.inventory.wheat.count -= this.constructor.craft_ratio
    }
  }
}
