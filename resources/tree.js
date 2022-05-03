import BaseResource from "./base_resource.js"

export default class Tree extends BaseResource {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.stump")

    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 1 // per sec
    this.max_collect_factor = 4 // per sec

    this.resources = 100

    Tree.objs.push(this)
  }

  growth() {}
}
