import BaseResource from "./base_resource.js"
import Item from "../items/item.js"
import { sample, normalDist, fnRandPerNMin } from "../helpers.js"

export default class Field extends BaseResource {
  static objs = []
  static item = {
    name: "wheat",
    weight: 0.5
  }

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "things.wheats.a.1")
    this.ctx = ctx
    this.opts = opts || {}

    this.sprite_version = sample(["a", "b", "c"])
    this.growth_state = normalDist(1, 4, 5)
    this.setSpriteByStage()

    this.min_collect_factor = 1 // per sec
    this.max_collect_factor = 5 // per sec

    this.growthRate = fnRandPerNMin(1.5)
    this.max_growth_state = 4

    this.resources = 0
  }

  inspect() {
    return [
      this.constructor.name,
      "Resources: " + this.resources,
      "Growth State: " + this.growth_state,
    ]
  }

  growthStageSprite() {
    return ["things.wheats", this.sprite_version, this.growth_state].join(".")
  }

  setSpriteByStage() {
    this.setSprite(this.growthStageSprite())
  }

  tick() {
    if (this.growth_state < this.max_growth_state && this.growthRate()) {
      this.growth_state += 1
      this.setSpriteByStage()

      if (this.growth_state == this.max_growth_state) {
        this.resources = normalDist(10, 50)
      }
    }
  }

  collect() {
    this.resources -= 1
    if (this.resources <= 0) {
      this.growth_state = 1
      this.setSpriteByStage()
      this.collector = undefined
    }
  }
}
