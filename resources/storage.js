import BaseResource from "./base_resource.js"

export default class Storage extends BaseResource {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.chest")
    this.ctx = ctx
    this.opts = opts || {}

    this.inventory = {}

    Storage.objs.push(this)
  }
}
