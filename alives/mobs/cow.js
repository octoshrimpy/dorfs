import BaseMob from "./baseMob.js"
import { rand, randOnePerNSec } from "/helpers.js"

export default class Cow extends BaseMob {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, "alives.animals.cow")
    this.ctx = ctx
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(5, 15) // 0-100

    Cow.objs.push(this)
    this.setRandomDest()
  }

  tick() {
    if (randOnePerNSec(10) == 0) {
      this.setRandomDest()
    }

    this.moveTowardsDest()
  }
}
