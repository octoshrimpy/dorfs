import Base from "./base.js"
import { scaleX, scaleY, idxFromPos } from "/helpers.js"

export default class Storage extends Base {
  static objs = []

  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.inventory = {}

    this.sprite = ctx.addSprite(opts.x, opts.y, "things.chest").setDepth(1)

    Storage.objs.push(this)
  }

  tick() {
    // Growth?
  }
}
