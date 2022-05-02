import BaseResource from "./baseResource.js"

export default class Rock extends BaseResource {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.rock")
    this.ctx = ctx
    this.opts = opts || {}

    this.min_collect_factor = 0.5 // per sec
    this.max_collect_factor = 3 // per sec

    this.resources = 100

    Rock.objs.push(this)
  }

  decay() {}
}
