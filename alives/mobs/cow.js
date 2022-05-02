import BaseMob from "./baseMob.js"
import { rand, randOnePerNSec } from "/helpers.js"

export default class Cow extends BaseMob {
  static objs = []
  constructor(ctx, opts) {
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}

    this.destination = undefined
    this.walk_speed = rand(5, 15) // 0-100

    this.sprite = this.setSprite("alives.animals.cow")

    Cow.objs.push(this)
    this.changeDest()
  }

  changeDest() {
    this.destination = {
      x: rand(32, this.ctx.game.config.width - 32),
      y: rand(32, this.ctx.game.config.height - 32),
    }
  }

  walkTowardsDest() {
    // https://phaser.io/news/2018/03/pathfinding-and-phaser-3
    if (!this.destination) { return }

    var dx = this.destination.x - this.sprite.x
    var dy = this.destination.y - this.sprite.y
    if (Math.abs(dx) < 5) { dx = 0 }
    if (Math.abs(dy) < 5) { dy = 0 }

    if (dx == 0 && dy == 0) {
      this.destination = undefined
      this.sprite.anims.stop(null)
      return
    }

    // this.sprite.anims.play([this.sprite, "walk"].join("."), true)
    this.sprite.flipX = dx < 0
    var max_speed = 2, max_speed_scale = 100
    var scaled_speed = (this.walk_speed / max_speed_scale) * max_speed
    var speed_scale = scaled_speed / (Math.abs(dx) + Math.abs(dy))

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
  }

  tick() {
    if (randOnePerNSec(10) == 0) {
      this.changeDest()
    }

    this.walkTowardsDest()
  }
}
