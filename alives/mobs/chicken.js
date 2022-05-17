import BaseMob from "./base_mob.js"
import { rand, weightedSample } from "/helpers.js"

export default class Chicken extends BaseMob {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, "alives.animals.chicken" + weightedSample(["1", 5], ["2", 3], ["3", 1]))
    this.ctx = ctx
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(5, 15) // 0-100

    this.setRandomDest()
  }
}
