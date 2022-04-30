import Base from "./base.js"
import { scaleX, scaleY, idxFromPos } from "/helpers.js"

export default class Rock extends Base {
  static objs = []

  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 4 // per sec
    this.max_collect_factor = 1 // per sec

    this.resources = 100

    this.sprite = ctx.env.add.sprite(opts.x, opts.y, "map", idxFromPos(2, 6)).setScale(3, 3).setDepth(1)

    Rock.objs.push(this)
  }

  tick() {
    // Growth?
  }
}
