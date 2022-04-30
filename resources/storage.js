import Base from "./base.js"
import { scaleX, scaleY, idxFromPos } from "/helpers.js"

export default class Storage extends Base {
  static objs = []

  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.inventory = {}

    this.sprite = ctx.env.add.sprite(opts.x, opts.y, "map", idxFromPos(8, 5)).setScale(1, 1).setDepth(1)

    Storage.objs.push(this)
  }

  tick() {
    // Growth?
  }
}
