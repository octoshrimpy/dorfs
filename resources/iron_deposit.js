import Rock from "./rock.js"
import { normalDist } from "../helpers.js"

export default class IronDeposit extends Rock {
  // Probably a better way to do this, we want iron to be shared by the Rock for purposes of
  //   pathfinding and presence.
  static item = {
    name: "iron_chunk",
    weight: 20
  }

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.rocks.iron.4")

    this.ctx = ctx
    this.opts = opts || {}

    this.min_collect_factor = 0.1 // per sec
    this.max_collect_factor = 1 // per sec

    this.resources = normalDist(5, 25, 3, 25)
    this.updateSprite()
  }

  addToClassObjs() {
    Rock.objs.push(this)
  }

  updateSprite() {
    let sprite_num = Math.floor((this.resources + 1) / 5) + 1
    if (sprite_num <= 4) { this.setSprite("things.rocks.iron." + sprite_num) }
  }

  collect() {
    this.updateSprite()
    super.collect()
  }
}
