import BaseClass from "../base_class.js"
import { rand, scaleVal } from "/helpers.js"

export default class BaseAlive extends BaseClass  {
  // #baseHealth
  // #baseMoveSpeed

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    opts = opts || {}
  }

  setRandomDest() {
    this.destination = {
      x: rand(32, this.ctx.game.config.width - 32),
      y: rand(32, this.ctx.game.config.height - 32),
    }
  }

  clearDest() {
    this.destination = undefined
    if (this.spriteHasAnim("stand")) {
      this.loopAnim("stand")
    } else {
      this.stopAnim()
    }
  }

  moveTowardsDest(speed) { // speed is 0-100
    // https://phaser.io/news/2018/03/pathfinding-and-phaser-3
    if (!this.destination) { return }

    var dx = this.destination.x - this.sprite.x
    var dy = this.destination.y - this.sprite.y
    if (Math.abs(dx) < 5) { dx = 0 }
    if (Math.abs(dy) < 5) { dy = 0 }

    if (dx == 0 && dy == 0) {
      this.clearDest()
      return
    }

    if (this.spriteHasAnim("walk")) {
      this.loopAnim("walk")
      var sprite_fps = scaleVal(this.walk_speed, 0, 100, 0, 20)
      this.sprite.anims.msPerFrame = 1000 / sprite_fps
    }
    this.sprite.flipX = dx < 0
    var max_speed = 2, max_speed_scale = 100
    var scaled_speed = (this.walk_speed / max_speed_scale) * max_speed
    var speed_scale = scaled_speed / (Math.abs(dx) + Math.abs(dy))

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
    this.sprite.depth = this.sprite.y
  }
}
