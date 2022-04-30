import Base from "./base.js"
import { scaleX, scaleY, idxFromPos } from "/helpers.js"

export default class Tree extends Base {
  static objs = []

  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.resources = 100

    this.sprite = ctx.env.add.sprite(opts.x, opts.y, "map", idxFromPos(4, 7)).setScale(4, 4).setDepth(1)

    Tree.objs.push(this)
  }

  tick() {
    // Growth?
  }
}
