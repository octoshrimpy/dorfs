import BaseMob from "./base_mob.js"
import { rand, weightedSample } from "/helpers.js"

export default class Cow extends BaseMob {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, "alives.animals.cow" + weightedSample(["1", 2], ["2", 1], ["3", 2]))
    this.ctx = ctx
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(2, 8)
    this.wander_scale = 10 // Move every 10 sec

    this.setRandomDest()
  }
}
