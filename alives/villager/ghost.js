import BaseAlive from "../base_alive.js"
import { rand, randOnePerNSec, normalDist } from "/helpers.js"

export default class Ghost extends BaseAlive {
  static objs = []

  constructor(villager) {
    super(villager.ctx, { x: villager.sprite.x, y: villager.sprite.y }, "alives.dorfs.ghost")
    this.ctx = villager.ctx
    this.name = villager.name
    this.cause = villager.cause_of_death

    this.destination = undefined
    this.walk_speed = rand(5, 10)
    this.wander_scale = 10 // Move every 10 sec

    this.sprite.alpha = (rand()/2) + 0.4
    this.wander()
  }

  tick() {
    if (randOnePerNSec(this.wander_scale || 10)) {
      this.wander()
    }
    if (randOnePerNSec(1)) {
      this.sprite.alpha += (rand() - 0.5)/10
    }
    if (randOnePerNSec(30)) {
      this.sprite.anims.msPerFrame = 1000 / (rand()*2)
    }

    this.moveTowardsDest()
  }

  inspect() {
    return [
      "Ghost of " + this.name,
      "Cause of death: " + this.cause
    ]
  }
}
