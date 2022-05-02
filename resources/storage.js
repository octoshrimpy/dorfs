import BaseResource from "./baseResource.js"

export default class Storage extends BaseResource {
  static objs = []

  constructor(ctx, opts) {
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}

    this.inventory = {}

    this.sprite = this.setSprite("things.chest") 

    Storage.objs.push(this)
  }
}
