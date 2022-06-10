import BaseWorkshop from "./base_workshop.js"
import Rock from "../resources/rock.js"
import { rand } from "../helpers.js"

export default class Quarry extends BaseWorkshop {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "buildings.quarry")
    this.ctx = ctx
    this.opts = opts || {}

    this.min_collect_factor = 0.01 // per sec
    this.max_collect_factor = 0.05

    this.collected_total = 0
  }

  inspect() {
    return [
      this.constructor.name,
      "Mined total: " + this.collected_total,
      this.collector?.name
    ]
  }

  tick() {
  }

  collect() {
    let world = this.ctx.world
    new Rock(this.ctx, {
      x: (rand(world.width - 8) + 4) * world.tileWidth,
      y: (rand(world.height - 8) + 4) * world.tileHeight
    })
    this.collected_total += 1
    if (this.collector.energy < 50 || this.collector.fullness < 50) {
      this.collector.finishTask()
    }
  }
}
