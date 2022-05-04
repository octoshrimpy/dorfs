import BaseHumanoid from "./base_humanoid.js"
import Tree from "../../resources/tree.js" //TODO fix these imports, ask game instead
import Rock from "../../resources/rock.js"
import Storage from "../../resources/storage.js"
import { sum, sample, normalDist, scaleVal, randOnePerNSec, randNPerSec } from "/helpers.js"

export default class Villager extends BaseHumanoid {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "alives.dorfs.adult")
    this.ctx = ctx
    this.opts = opts || {}

    this.name = function() {
      var name_json = ctx.env.cache.json.get("names")
      return [sample(name_json.first), sample(name_json.last)].join(" ")
    }()

    this.destination = undefined
    this.inventory = {}
    this.unloading = false
    this.collecting = false
    this.walk_speed = opts.walk_speed || normalDist(10, 70, 4) // 0-100
    this.collect_speed = opts.collect_speed || normalDist(10, 70, 4) // 0-100
    this.carry_capacity = opts.carry_capacity || normalDist(60, 120, 4)
    this.selected = false
    this.highlight = undefined
    this.bored = false

    this.home = undefined
    this.job_building = undefined
    this.selected_resource = undefined
    this.selected_storage = undefined
    this.profession = sample(["Lumberjack", "Miner"])
    this.tool_sprite = undefined

    Villager.objs.push(this)
  }

  clicked() {
    Villager.all().forEach(function(v) {
      v.selected = false
      v.highlight?.destroy(true)
      v.highlight = undefined
    })
    this.select()
    console.log(this)
  }

  select() {
    this.selected = true
    if (this.highlight) { return }
    this.highlight = this.ctx.addSpriteWithAnim("tools.highlight", { x: this.sprite.x, y: this.sprite.y })
    this.highlight.depth = this.sprite.depth - 1
    this.highlight.flipX = this.sprite.flipX
  }

  getToolName() {
    if (this.profession == "Lumberjack") {
      return "tools.axe"
    } else if (this.profession == "Miner") {
      return "tools.pick"
    }
  }

  showTool() {
    if (this.tool_sprite) { return } // Don't add another sprite if one exists already

    let tool_path = this.getToolName()
    this.tool_sprite = this.ctx.addSpriteWithAnim(tool_path, { x: this.sprite.x, y: this.sprite.y })
    this.tool_sprite.depth = this.sprite.depth + 1
    this.tool_sprite.flipX = this.sprite.flipX
    this.tool_sprite.anims.play([tool_path, "base"].join("."), true)
    var sprite_fps = scaleVal(this.collect_speed, 0, 100, 0, 20)
    this.tool_sprite.anims.msPerFrame = 1000 / sprite_fps
  }

  hideTool() {
    this.tool_sprite?.destroy(true)
    this.tool_sprite = undefined
  }

  getProfession() {
    if (this.profession == "Lumberjack") {
      return Tree
    } else if (this.profession == "Miner") {
      return Rock
    }
  }

  fullInventory() {
    return sum(Object.values(this.inventory).map(function(item) { return item.totalWeight() })) >= this.carry_capacity
  }

  findDestination() {
    let dest_obj = null

    if (this.fullInventory() || this.unloading) {
      if (this.collecting) {
        this.hideTool()
        this.collecting = false
      }
      this.unloading = true
      dest_obj = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
      this.selected_storage = dest_obj
    } else {
      if (this.selected_resource && this.selected_resource.resources <= 0) {
        this.selected_resource = undefined
      }
      dest_obj = this.selected_resource || this.getProfession().nearest(this.sprite.x, this.sprite.y)
      this.selected_resource = dest_obj
    }
    if (!dest_obj) { return }

    return dest_obj
  }

  arrivedAtDest() {
    let x_near = Math.abs(this.sprite.x - this.destination.x) < 5
    let y_near = Math.abs(this.sprite.y - this.destination.y) < 5

    return x_near && y_near
  }

  unload(obj) {
    obj.inventory[this.profession] ||= new (this.getProfession().item)
    if (randNPerSec(10) == 0) {
      if (this.inventory[this.profession].count > 0) {
        obj.inventory[this.profession].count += 1
        this.inventory[this.profession].count -= 1
      } else {
        this.unloading = false
      }
    }
  }

  collect(obj) {
    if (obj.resources <= 0) {
      this.collecting = false
      this.hideTool()
      this.clearDest()
      this.findDestination()
      return
    }

    if (!this.collecting) {
      this.collecting = true
      this.showTool()
    }

    this.inventory[this.profession] ||= new (this.getProfession().item)

    var collectRatePerSec = scaleVal(this.collect_speed, 0, 100, obj.min_collect_factor, obj.max_collect_factor)
    if (randNPerSec(collectRatePerSec) == 0) {
      if (obj.resources > 0) {
        obj.collect()
        this.inventory[this.profession].count += 1
      }
    }
  }

  tick() {
    if (this.selected_resource && this.selected_resource.resources <= 0) {
      this.collecting = false
      this.selected_resource = undefined
      this.hideTool()
      this.clearDest()
    }

    if (!this.destination) {
      var obj = this.findDestination()

      if (obj) {
        if (this.bored) { this.bored = false; console.log(this.name + " (" + this.profession + ") found something to do!"); }
        this.destination = { x: obj.sprite.x, y: obj.sprite.y }

        if (this.arrivedAtDest()) {
          if (obj.constructor.name == "Storage") {
            this.unload(obj)
          } else {
            this.collect(obj)
          }
        }
      } else {
        if (!this.bored) { this.bored = true; console.log(this.name + " (" + this.profession + ") is bored..."); }
        if (randOnePerNSec(5) == 0) { this.setRandomDest() }
      }
    }

    this.moveTowardsDest()
  }
}
