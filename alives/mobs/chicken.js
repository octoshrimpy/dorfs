import BaseMob from "./base_mob.js"
import Villager from "../villager/villager.js"
import { rand, weightedSample } from "../../helpers.js"

export default class Chicken extends BaseMob {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "alives.animals.chickens." + weightedSample(["white", 5], ["brown", 3], ["black", 1]))
    this.ctx = ctx
    this.opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(5, 15) // 0-100

    this.wander()
  }

  tick() {
    let scared_distance = 50
    let scared_speed = this.walk_speed * 2

    super.tick()

    if (!this.sprite) { return }
    let x1 = this.sprite.x, y1 = this.sprite.y
    let nearby = Villager.objs.find(function(obj) {
      let x2 = obj.sprite.x, y2 = obj.sprite.y
      let dist = Math.abs(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2))

      return dist < scared_distance
    })

    if (nearby) {
      this.scared = true

      this.speed = scared_speed
      this.destination = {
        x: x1 - (nearby.sprite.x - x1)*2 + rand(-3, 3),
        y: y1 - (nearby.sprite.y - y1)*2 + rand(-3, 3),
      }
    } else {
      this.scared = false
    }
  }
}
