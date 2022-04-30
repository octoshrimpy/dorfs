import Base from "./base.js"
import Tree from "/resources/tree.js"
import Rock from "/resources/rock.js"
import Storage from "/resources/storage.js"
import { sum, sample, rand, scaleVal, randOnePerNSec, randNPerSec } from "/helpers.js"

export default class Villager extends Base {
  static objs = []
  constructor(ctx, opts) {
    super()
    this.ctx = ctx
    opts = opts || {}

    this.destination = undefined
    this.inventory = {}
    this.task = "tree"
    // this.task = sample(["tree", "rock", undefined])
    this.unloading = false
    this.walk_speed = rand(20, 60) // 0-100
    this.collect_speed = rand(20, 60) // 0-100

    this.sprite = this.ctx.env.add.sprite(opts.x || 0, opts.y || 0, "slime").setDepth(10)

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

    Villager.objs.push(this)
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

    var dir
    if (Math.abs(dx) > Math.abs(dy)) {
      // horz sprite
      dir = dx > 0 ? "right" : "left"
    } else {
      // vert sprite
      dir = dy > 0 ? "down" : "up"
    }
    this.sprite.anims.play(dir, true)
    var max_speed = 2, max_speed_scale = 100
    var scaled_speed = (this.walk_speed / max_speed_scale) * max_speed
    var speed_scale = scaled_speed / (Math.abs(dx) + Math.abs(dy))

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
  }

  fullInventory() {
    return sum(Object.values(this.inventory)) >= 10
  }

  tick() {
    let fps = 60
    if (!this.task) {
      if (randOnePerNSec(3) == 0) {
        this.changeDest()
      }
    } else if (!this.destination) {
      var obj = undefined

      if (this.fullInventory() || this.unloading) {
        this.unloading = true
        obj = Storage.all()[0]
      } else {
        if (this.task == "tree") {
          obj = Tree.all()[0]
        } else if (this.task == "rock") {
          obj = Rock.all()[0]
        }
      }

      if (obj) {
        this.destination = {}
        this.destination.x = obj.sprite.x
        this.destination.y = obj.sprite.y

        if (Math.abs(this.sprite.x - obj.sprite.x) < 5 && Math.abs(this.sprite.y - obj.sprite.y) < 5) {
          if (obj.constructor.name == "Storage") {
            obj.inventory[this.task] ||= 0
            if (randNPerSec(10) == 0) {
              if (this.inventory[this.task] > 0) {
                obj.inventory[this.task] += 1
                this.inventory[this.task] -= 1
                console.log("unloading " + this.task, this.inventory[this.task]);
              } else {
                this.unloading = false
              }
            }
          } else {
            this.inventory[this.task] ||= 0

            var collectRatePerSec = scaleVal(this.collect_speed, 0, 100, obj.min_collect_factor, obj.max_collect_factor)
            if (randNPerSec(collectRatePerSec) == 0) {
              this.inventory[this.task] += 1
              console.log("collecting " + this.task, this.inventory[this.task]);
            }
          }
        }
      }
    }

    this.walkTowardsDest()
  }
}
