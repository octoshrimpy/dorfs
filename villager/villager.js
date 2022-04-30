import Base from "./base.js"

var villagers = []

export default class Villager extends Base {
  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.destination = undefined

    this.sprite = this.ctx.env.add.sprite(opts.x || 0, opts.y || 0, "slime")
    // this.sprite.setScale(4, 4)
    // this.sprite.setCollideWorldBounds(true)

    this.ctx.env.anims.create({
      key: "down",
      frames: this.ctx.env.anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.ctx.env.anims.create({
      key: "right",
      frames: this.ctx.env.anims.generateFrameNumbers("slime", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.ctx.env.anims.create({
      key: "up",
      frames: this.ctx.env.anims.generateFrameNumbers("slime", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1
    })

    this.ctx.env.anims.create({
      key: "left",
      frames: this.ctx.env.anims.generateFrameNumbers("slime", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    })

    this.ctx.env.anims.create({
      key: "stand",
      frames: [ { key: "slime", frame: 4 } ],
      frameRate: 20
    })

    villagers.push(this)
    this.changeDest()
  }

  // Class method
  static tick() {
    villagers.forEach(function(villager) {
      villager.tick()
    })
  }

  changeDest() {
    this.destination = {
      x: Math.floor(Math.random() * this.ctx.game.config.width),
      y: Math.floor(Math.random() * this.ctx.game.config.height),
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

    var dir
    if (Math.abs(dx) > Math.abs(dy)) {
      // horz sprite
      dir = dx > 0 ? "right" : "left"
    } else {
      // vert sprite
      dir = dy > 0 ? "down" : "up"
    }
    this.sprite.anims.play(dir, true)
    var speed = 1
    var speed_scale = speed / (Math.abs(dx) + Math.abs(dy))

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
  }

  // motion(cursors) {
  //   var up = cursors.up.isDown
  //   var right = cursors.right.isDown
  //   var down = cursors.down.isDown
  //   var left = cursors.left.isDown
  //
  //   var directionY, directionX, spriteDirection
  //   directionY = (up && !down) ? "up" : (down && !up) ? "down" : undefined
  //   directionX = (left && !right) ? "left" : (right && !left) ? "right" : undefined
  //   spriteDirection = directionX || directionY
  //
  //   if (spriteDirection) {
  //     this.sprite.anims.play(spriteDirection, true)
  //   } else {
  //     this.sprite.anims.stop(null)
  //   }
  //
  //   if (directionY == "up") { this.sprite.setVelocityY(-160) }
  //   if (directionY == "down") { this.sprite.setVelocityY(160) }
  //   if (directionY == undefined) { this.sprite.setVelocityY(0) }
  //
  //   if (directionX == "left") { this.sprite.setVelocityX(-160) }
  //   if (directionX == "right") { this.sprite.setVelocityX(160) }
  //   if (directionX == undefined) { this.sprite.setVelocityX(0) }
  // }

  tick() {
    if (Math.random() * 60) { // 1/1000 - Roughly every 16 seconds
      this.changeDest()
    }

    this.walkTowardsDest()
  }
}
