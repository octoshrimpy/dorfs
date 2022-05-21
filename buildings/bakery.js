import BaseBuilding from "./base_building.js"

export default class Bakery extends BaseBuilding {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "buildings.bakery")
    this.ctx = ctx
    this.opts = opts || {}
  }
}
