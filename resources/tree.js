import BaseResource from "./baseResource.js"

export default class Tree extends BaseResource {
  static objs = []

  constructor(ctx, opts) {
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 1 // per sec
    this.max_collect_factor = 4 // per sec

    this.resources = 100

    this.sprite = this.setSprite("things.stump")

    Tree.objs.push(this)
  }

  growth() {

  }
}
