import BaseMob from "./base_mob.js"
import { rand, weightedSample } from "../../helpers.js"

export default class Cow extends BaseMob {
  static objs = []

  constructor(opts, sprite_path) {
    let randCowSprite = function() {
      return "alives.animals.cows." + weightedSample(["light", 2], ["white", 1], ["brown", 2])
    }
    super(opts, sprite_path || randCowSprite())
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(2, 8)
    this.wander_scale = 10 // Move every 10 sec

    this.wander()
  }
}
