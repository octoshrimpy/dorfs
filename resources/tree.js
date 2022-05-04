import BaseResource from "./base_resource.js"
import LogItem from "../items/log_item.js"

export default class Tree extends BaseResource {
  static objs = []
  static item = LogItem

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.tree")

    this.ctx = ctx
    opts = opts || {}

    this.min_collect_factor = 1 // per sec
    this.max_collect_factor = 4 // per sec

    this.resources = rand(50, 100)

    Tree.objs.push(this)
  }

  growth() {}
}
