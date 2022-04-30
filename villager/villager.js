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
    this.task = sample(["tree", "rock", undefined])
    this.unloading = false
    this.walk_speed = rand(20, 60) // 0-100
    this.collect_speed = rand(20, 60) // 0-100
    this.selected_resource = undefined

    this.anim_key = "alives.dorfs.adult"
    this.sprite = ctx.addSpriteAnim(opts.x, opts.y, this.anim_key).setDepth(10)

    Villager.objs.push(this)
    if (!this.task) { this.changeDest() }
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

    this.sprite.anims.play([this.anim_key, "walk"].join("."), true)
    this.sprite.flipX = dx < 0
    var max_speed = 2, max_speed_scale = 100
    var scaled_speed = (this.walk_speed / max_speed_scale) * max_speed
    var speed_scale = scaled_speed / (Math.abs(dx) + Math.abs(dy))

    this.sprite.x += dx * speed_scale
    this.sprite.y += dy * speed_scale
  }

  fullInventory() {
    return sum(Object.values(this.inventory)) >= 10
  }

  selectResource() {
    if (this.task) {
      if (!this.selected_resource || this.selected_resource.resources <= 0) {
        if (this.task == "tree") {
          this.selected_resource = sample(Tree.all())
        } else if (this.task == "rock") {
          this.selected_resource = sample(Rock.all())
        }
      }
    }

    return this.selected_resource
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
        obj = this.selectResource()
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
              } else {
                this.unloading = false
              }
            }
          } else {
            this.inventory[this.task] ||= 0

            var collectRatePerSec = scaleVal(this.collect_speed, 0, 100, obj.min_collect_factor, obj.max_collect_factor)
            if (randNPerSec(collectRatePerSec) == 0) {
              this.inventory[this.task] += 1
            }
          }
        }
      }
    }

    this.walkTowardsDest()
  }
}
