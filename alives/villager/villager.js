import BaseHumanoid from "./base_humanoid.js"
import Corpse from "./corpse.js"
import Ghost from "./ghost.js"
import BaseJob from "../../jobs/base_job.js"
import Item from "../../items/item.js"
import Storage from "../../resources/storage.js"
import { sum, sample, normalDist, scaleVal, randPerNSec, randNPerSec } from "../../helpers.js"

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
    this.fullness = normalDist(50, 100, 5, 90)
    this.status = undefined // working, bored, starving, tired, etc
    // Certain statuses should take priority, and use the status to short-circuit other activities
    // For example, immediately stop working and go find food when starving

    this.home = undefined
    this.job_building = undefined
    this.selected_resource = undefined
    this.selected_storage = undefined
    this.profession = undefined
    this.takeRandomProfession()
    this.tool_sprite = undefined
  }

  inspect() {
    return [
      this.name,
      "Profession: " + this.profession?.name,
      this.bored ? "Wandering..." : (this.collecting ? "Collecting" : (this.unloading ? "Unloading" : "Traveling")),
      ...Object.entries(this.inventory).filter(function([name, item]) {
        return item.count > 0
      }).map(function([name, item]) {
        return name + ": " + item.count + " (" + item.totalWeight() + " lbs)"
      }),
      // "Destination: " + JSON.stringify(this.destination),
      "Walk Speed: " + this.walk_speed,
      "Collect Speed: " + this.collect_speed,
      "Carry Capacity: " + this.carry_capacity,
      "Fullness: " + this.fullness,
      // "Home: " + this.home,
      // "Job Building: " + this.job_building,
      // "Selected Resource: " + this.selected_resource,
      // "Selected Storage: " + this.selected_storage,
    ]
  }

  showTool() {
    let tool_path = this.profession?.tool
    if (!tool_path) { return }

    this.tool_sprite = this.ctx.addSpriteWithAnim(tool_path, { x: this.sprite.x, y: this.sprite.y })
    this.tool_sprite.anims.play([tool_path, "base"].join("."), true)
    var sprite_fps = scaleVal(this.collect_speed, 0, 100, 0, 20)
    this.tool_sprite.anims.msPerFrame = 1000 / sprite_fps
  }

  showHighlight() {
    this.highlight = this.ctx.addSpriteWithAnim("tools.highlight", { x: this.sprite.x, y: this.sprite.y })
  }

  hideSprite(sprite) {
    this[sprite]?.destroy(true)
    this[sprite] = undefined
  }

  takeProfession(new_profession) {
    var old_profession = this.profession
    this.profession = new_profession

    if (new_profession != old_profession) {
      this.setSprite(this.profession?.sprite)
    }
    if (!this.profession) {
      this.setSprite("alives.dorfs.adult")
    }
  }

  takeRandomProfession() {
    this.takeProfession(BaseJob.randProf())
  }

  prepInventoryForProfession() {
    let site = this.profession?.workSite()
    if (!site) { return }

    this.inventory[site.item.name] ||= site.newItem()
  }

  inventoryWeight() {
    return sum(Object.values(this.inventory).map(function(item) {
      return item.totalWeight()
    }))
  }

  fullInventory() {
    return this.inventoryWeight() >= this.carry_capacity
  }

  shouldUnload() {
    return this.unloading || this.fullInventory()
  }

  shouldFindFood() {
    if (this.unloading || this.collecting || this.fullness > 50) { return false }

    var storage = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    this.selected_storage = storage
    return storage.inventory.bread?.count > 0
  }

  findDestination() {
    let dest_obj = null

    if (this.shouldFindFood()) {
      dest_obj = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    } else if (this.shouldUnload()) {
      this.collecting = false
      this.unloading = true
      dest_obj = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
      this.selected_storage = dest_obj
    } else {
      if (this.selected_resource?.collector != this || this.selected_resource.removed) {
        this.clearSelectedResource()
      }
      dest_obj = this.selected_resource || this.profession?.workSite()?.nearest(this.sprite.x, this.sprite.y)
      this.selected_resource = dest_obj

      if (this.selected_resource) {
        this.selected_resource.collector = this
      } else if (this.inventoryWeight() > 0) {
        this.unloading = true
        return this.findDestination()
      }
    }

    return dest_obj
  }

  die(cause) {
    this.status = "dead"
    this.cause_of_death = cause
    if (this.selected_resource?.collector == this) {
      this.selected_resource.collector = undefined
    }
    console.log(this.name + " has died of " + cause);
    new Corpse(this)
    new Ghost(this)

    this.hideSprite("tool_sprite")
    this.hideSprite("highlight")

    this.remove()
  }

  eatFrom(obj) {
    if (randPerNSec(5) && obj.inventory.bread?.count > 0) {
      obj.inventory.bread.count -= 1
      this.fullness += 10
    }
  }

  unload(obj) {
    if (randNPerSec(10)) {
      let [item_name, item] = Object.entries(this.inventory).find(function([name, item_ref]) {
        return item_ref.count > 0
      }) || []
      if (item_name && this.inventory[item_name].count > 0) {
        obj.inventory[item_name] ||= new Item(item.opts)
        obj.inventory[item_name].count += 1
        this.inventory[item_name].count -= 1
      } else {
        this.unloading = false
      }
    }
  }

  collect(obj) {
    if (obj.resources <= 0) {
      this.collecting = false
      this.clearDest()
      this.unloading = true
      this.findDestination()
      return
    }

    if (randPerNSec(30)) { this.fullness -= 1 }

    this.collecting = true

    this.prepInventoryForProfession()

    var collectRatePerSec = scaleVal(this.collect_speed, 0, 100, obj.min_collect_factor, obj.max_collect_factor)
    if (randNPerSec(collectRatePerSec)) {
      if (obj.resources > 0) {
        this.inventory[obj.item.name].count += 1
        obj.collect()
      }
    }
  }

  clearSelectedResource() {
    if (this.selected_resource && this.selected_resource.collector == this) {
      this.selected_resource.collector = undefined
    }
    this.selected_resource = undefined
  }

  tick() {
    if (this.status == "dead") { return } // Stops next tick from coming back to life
    if (this.fullness <= 0) { return this.die("starvation") }
    if (randPerNSec(60)) { this.fullness -= 1 }

    if (this.fullness < 20 && this.fullness > 10) {
      this.takeProfession(BaseJob.profByName("Farmer"))
    } else if (this.fullness <= 10) {
      if (Villager.objs.find(function(villager) { return villager.profession?.name == "baker" })) {
        this.takeProfession(BaseJob.profByName("Farmer"))
      } else if (this.selected_storage.inventory.bread?.count < 100) {
        this.takeProfession(BaseJob.profByName("Farmer"))
      } else {
        this.takeProfession(BaseJob.profByName("Baker"))
      }
    }

    if (this.selected_resource && this.selected_resource.resources <= 0) {
      this.collecting = false
      this.clearSelectedResource()
      this.clearDest()
    }

    if (!this.destination) {
      var obj = this.findDestination()

      if (obj) {
        if (this.bored) { this.bored = false }
        this.destination = { x: obj.access_origin.x, y: obj.access_origin.y }

        if (this.arrivedAtDest()) {
          if (obj.constructor.name == "Storage") {
            if (this.inventoryWeight() == 0 && this.fullness < 90 && this.selected_storage.inventory.bread?.count > 0) {
              this.eatFrom(obj)
            } else {
              this.unload(obj)
            }
          } else {
            this.collect(obj)
          }
        }
      } else {
        if (!this.bored) { this.bored = true }
        if (randNPerSec(10)) {
          this.wander()
          this.takeRandomProfession()
        }
      }
    }

    this.moveTowardsDest()
    this.draw()
  }

  followSprite(sprite, depth_offset=1) {
    sprite.x = this.sprite.x
    sprite.y = this.sprite.y
    sprite.flipX = this.sprite.flipX
    sprite.depth = this.sprite.depth + depth_offset
  }

  draw() {
    if (this.collecting && !this.tool_sprite) { this.showTool() }
    if (!this.collecting && this.tool_sprite) { this.hideSprite("tool_sprite") }
    if (this.tool_sprite) { this.followSprite(this.tool_sprite) }

    if (this.selected && !this.highlight) { this.showHighlight() }
    if (!this.selected && this.highlight) { this.hideSprite("highlight") }
    if (this.highlight) { this.followSprite(this.highlight, -1) }
  }

  // getRandomDorfSprite(){
  //   let list_wear           = ["blue_dark", "blue", "green_dark", "green"]
  //   let list_skin           = ["fair", "light", "dark"]
  //   let list_hair_color     = ["brown", "black", "ashen", "copper", "blonde", "redhead"]
  //   let list_hair_color_old = ["silver", "white"]
  //   let list_beard_style    = ["full", "managed", "handlebar", "pedostache", "clean"]
  //   let list_hair_style     = ["bowl", "bald", "part", "mohawk", "zucc", "monk", "shag", "clean"]
  //
  //   let wear_pants  = this._getRandFrom(list_wear)
  //   let wear_shirt  = this._getRandFrom(list_wear)
  //   let skin  = this._getRandFrom(list_skin)
  //   let hairs = this._getRandFrom(list_hair_color)
  //   let beard = this._getRandFrom(list_beard_style)
  //   let hair  = this._getRandFrom(list_hair_style)
  //
  //   return {wear_pants, wear_shirt, skin, hairs, beard, hair}
  // }
  //
  // _getRandFrom(array) {
  //   return array[Math.floor(Math.random() * array.length)]
  // }
}
