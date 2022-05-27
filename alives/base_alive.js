import BaseObject from "../base_object.js"
import { rand, scaleX, scaleY, scaleVal, constrain, normalDist, speed_multiplier } from "../helpers.js"

export default class BaseAlive extends BaseObject  {
  // #baseHealth
  // #baseMoveSpeed

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    opts = opts || {}
    this.constructor.objs.push(this)
  }

  wander() {
    if (!this.sprite) { return }
    let self = this
    let constrainWorldX = function(val) {
      return constrain(val, scaleX(1), self.ctx.game.config.width - scaleX(1))
    }
    let constrainWorldY = function(val) {
      return constrain(val, scaleY(1), self.ctx.game.config.height - scaleY(1))
    }

    this.speed = normalDist(0, this.walk_speed, 2, this.walk_speed*0.8)
    this.destination = {
      x: rand(constrainWorldX(this.sprite.x - 100), constrainWorldX(this.sprite.x + 100)),
      y: rand(constrainWorldY(this.sprite.y - 100), constrainWorldY(this.sprite.y + 100)),
    }
  }

  arrivedAtDest() {
    let x_near = Math.abs(this.sprite.x - this.destination.x) < 5
    let y_near = Math.abs(this.sprite.y - this.destination.y) < 5

    return x_near && y_near
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
    speed = (speed || this.speed || this.walk_speed) * speed_multiplier
    // https://phaser.io/news/2018/03/pathfinding-and-phaser-3
    if (!this.destination || !this.sprite) { return }

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
      var sprite_fps = scaleVal(speed, 0, 100, 0, 20)
      this.sprite.anims.msPerFrame = (1000 / sprite_fps) * speed_multiplier
    }
    this.sprite.flipX = dx < 0
    var max_speed = 2, max_speed_scale = 100
    var scaled_speed = (speed / max_speed_scale) * max_speed
    var speed_scale = scaled_speed / (Math.abs(dx) + Math.abs(dy))
    if (speed_scale > 1) { speed_scale = 1 }

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
    this.sprite.depth = this.sprite.y
  }
}
