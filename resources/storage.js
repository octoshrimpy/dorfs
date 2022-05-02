import BaseResource from "./baseResource.js"

export default class Storage extends BaseResource {
  static objs = []

  constructor(ctx, opts) {
    this.spritePath = "things.chest"
    
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}

    this.inventory = {}


    Storage.objs.push(this)
  }
}
