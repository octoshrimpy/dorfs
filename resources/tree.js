import BaseResource from "./base_resource.js"
import { rand } from "../helpers.js"

export default class Tree extends BaseResource {
  static objs = []
  static item = {
    name: "wood",
    weight: 3
  }

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.trees.oak")

    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 1 // per sec
    this.max_collect_factor = 4 // per sec

    this.resources = rand(50, 100)
  }

  collect() {
    let sprite_num = Math.floor((this.resources + 1) / 5) + 1
    if (sprite_num <= 4) { this.setSprite("things.trees.small." + sprite_num) }
    super.collect()
  }
}
