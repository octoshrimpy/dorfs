import BaseResource from "./baseResource.js"

export default class Rock extends BaseResource {
  static objs = []

  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 0.5 // per sec
    this.max_collect_factor = 3 // per sec

    this.resources = 100

    this.sprite = "things.rock"

    Rock.objs.push(this)
  }

  decay() {

  }
}
