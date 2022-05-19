import BaseMob from "./base_mob.js"
import { rand, weightedSample } from "/helpers.js"

export default class Chicken extends BaseMob {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, "alives.animals.chickens." + weightedSample(["white", 5], ["brown", 3], ["black", 1]))
    this.ctx = ctx
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(5, 15) // 0-100

    this.setRandomDest()
  }
}
