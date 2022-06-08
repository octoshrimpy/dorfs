import BaseHumanoid from "./base_humanoid.js"
import Corpse from "./corpse.js"
import Ghost from "./ghost.js"
import BaseJob from "../../jobs/base_job.js"
import Bakery from "../../buildings/bakery.js"
import Item from "../../items/item.js"
import Storage from "../../resources/storage.js"
import { sum, sample, normalDist, scaleVal, randPerNSec, randNPerSec, min } from "../../helpers.js"
import House from "../../buildings/house.js"

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
    this.actions = {
      unloading: false,
      collecting: false,
      sleeping: false,
      wandering: false,
      walkingToAction: false, // moving to storage, bed, looking for food, etc
    }
    // this.actions.unloading = false
    // this.actions.collecting = false
    // this.sleeping = false
    this.walk_speed = opts.walk_speed || normalDist(10, 70, 4) // 0-100
    this.collect_speed = opts.collect_speed || normalDist(10, 70, 4) // 0-100
    this.carry_capacity = opts.carry_capacity || normalDist(60, 120, 4)
    this.selected = false
    this.highlight = undefined
    this.bored = false // @think bored here vs line 36
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

    this.sleepies = 0
    this.sleepies_rate = opts.sleepies_rate || normalDist(11, 20, 2)
    this.selected_house = undefined

    this.wander()
  }

  static countWithJob(job) {
    return Villager.objs.filter(function(villager) {
      return villager.profession?.name == job
    }).length
  }

  inspect() {
    return [
      this.name,
      "Profession: " + this.profession?.name,
      this.bored ? "Wandering..." : (this.actions.collecting ? "Collecting" : (this.actions.unloading ? "Unloading" : "Traveling")),
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
      "Sleepies: " + this.sleepies,
      "Sleepies Rate: " + this.sleepies_rate,
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
      this.clearSelectedResource()
      this.setSprite(this.profession?.sprite)
    }
    if (!this.profession) {
      this.setSprite("alives.dorfs.adult")
    }
  }

  chooseProfession() {
    let this_prof = this.profession?.name
    let is_baker = this_prof == "Baker"
    let is_starving = this.fullness < 10
    let has_many_farmers = Villager.countWithJob("Farmer") > 4
    let has_baker = Villager.countWithJob("Baker") > 0
    let has_fields = BaseJob.profByName("Farmer")?.workSite()?.nearest(this.sprite.x, this.sprite.y)
    let has_wheat = this.selected_storage?.inventory?.wheat?.count > Bakery.craft_ratio

    if (has_wheat && (is_baker || !has_baker)) {
      this.takeProfession(BaseJob.profByName("Baker"))
    } else if (!has_many_farmers && has_fields) {
      this.takeProfession(BaseJob.profByName("Farmer"))
    } else if (is_starving) {
      // Sit and wait at storage for food
      let obj = this.selected_storage
      this.destination = { x: obj.access_origin.x, y: obj.access_origin.y }
    } else {
      this.takeRandomProfession()
    }
  }

  takeRandomProfession() {
    let new_prof = BaseJob.randProf()
    // Only switch professions if there is work to be done.
    if (new_prof?.workSite()?.nearest(this.sprite.x, this.sprite.y)) {
      this.takeProfession(new_prof)
    }
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
    return this.actions.unloading || this.fullInventory()
  }

  shouldEat() {
    if (this.fullness >= 90) { return false } // Already full
    if (!(this.selected_storage.inventory.bread?.count > 0)) { return false } // Can't eat if no food
    if (this.fullness <= 50) { return true } // If hungry, be selfish and eat

    // Hungriest villager gets first dibs
    return min(Villager.objs.map(villager => villager.fullness )) >= this.fullness
  }

  shouldFindFood() {
    if (this.actions.unloading || this.actions.collecting || this.fullness > 50) { return false }

    var storage = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    this.selected_storage = storage
    return storage.inventory.bread?.count > 0
  }

  // taking turns sleeping
  // shouldRest() {
  //   if (this.sleepies >= 90) { return false } // not tired
  //   if (this.selected_house?.isFull()) { return false } // cant sleep if no bed
  //   if (this.sleepies <=50) {return true}

  //   // most tired dorfs get first dibs
  //   return min(Villager.objs.map(villager => villager.sleepies)) >= this.sleepies
  // }

  shouldFindRest() {
    console.log("wants rest", this)
    if (this.actions.unloading || this.actions.collecting || this.sleepies < 50) { return false }

    var house = this.selected_house || House.nearest(this.sprite.x, this.sprite.y)
    this.selected_house = house
    return true
  }

  findDestination() {
    let dest_obj = null

    if (this.shouldFindFood()) {
      dest_obj = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    } else if (this.shouldUnload()) {
      Object.keys(this.actions).forEach(item => {
        this.actions[item] = false
      })
      this.actions.unloading = true
      dest_obj = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
      this.selected_storage = dest_obj
    } else if (this.shouldFindRest()) {
      Object.keys(this.actions).forEach(item => {
        this.actions[item] = false
      })
      this.actions.sleeping = true
      dest_obj = this.selected_house || House.nearest(this.sprite.x, this.sprite.y)
      this.selected_house = dest_obj
    }else {
      if (this.selected_resource?.collector != this || this.selected_resource.removed) {
        this.clearSelectedResource()
      }
      dest_obj = this.selected_resource || this.profession?.workSite()?.nearest(this.sprite.x, this.sprite.y)
      this.selected_resource = dest_obj

      if (this.selected_resource) {
        this.selected_resource.collector = this
      } else if (this.inventoryWeight() > 0) {
        this.actions.unloading = true
        return this.findDestination()
      }
    }

    return dest_obj
  }

  die(cause) {
    this.status = "dead"
    this.cause_of_death = cause
    this.clearSelectedResource()
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
        this.actions.unloading = false
        this.chooseProfession()
      }
    }
  }

  collect(obj) {
    if (obj.resources <= 0) {
      this.actions.collecting = false
      this.clearDest()
      this.actions.unloading = true
      this.findDestination()
      return
    }

    if (randPerNSec(25)) { this.fullness -= 1 }

    this.actions.collecting = true

    this.prepInventoryForProfession()

    var collectRatePerSec = scaleVal(this.collect_speed, 0, 100, obj.min_collect_factor, obj.max_collect_factor)
    if (randNPerSec(collectRatePerSec)) {
      if (obj.resources > 0) {
        this.inventory[obj.item.name].count += 1
        obj.collect()
      }
    }
  }

  sleepIn(obj) {
    Object.keys(this.actions).forEach(item => {
      this.actions[item] = false
    })
    this.sleeping = true

    obj.sleepyDorfs.push(this)
  }

  clearSelectedResource() {
    if (this.selected_resource && this.selected_resource.collector == this) {
      this.selected_resource.collector = undefined
    }
    this.selected_resource = undefined
  }

  tick() {
    if (this.actionstatus == "dead") { return } // Stops next tick from coming back to life
    if (this.fullness <= 0) { return this.die("starvation") }
    if (randPerNSec(75)) { this.fullness -= 1 }
    if (randNPerSec(75)) { this.sleepies += 1 }

    if (this.selected_resource && this.selected_resource.resources <= 0) {
      this.actions.collecting = false
      this.clearSelectedResource()
      this.clearDest()
    }

    if (!this.destination) {
      var obj = this.findDestination()

      if (obj) {
        if (this.bored) { this.bored = false }
        this.destination = { x: obj.access_origin.x, y: obj.access_origin.y }
        this.speed = this.walk_speed

        if (this.arrivedAtDest()) {
          if (obj.constructor.name == "Storage") {
            if (this.shouldEat()) {
              this.eatFrom(obj)
            } else {
              this.unload(obj)
            }
          } else 
          if (obj.constructor.name == "House") {
            this.sleepIn(obj)
          } else {
            this.collect(obj)
          }
        }
      } else {
        if (!this.bored) { this.bored = true }
        if (randPerNSec(3)) {
          this.chooseProfession()
          if (!this.profession?.workSite()?.nearest(this.sprite.x, this.sprite.y)) {
            this.wander()
          }
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
    if (this.actions.collecting && !this.tool_sprite) { this.showTool() }
    if (!this.actions.collecting && this.tool_sprite) { this.hideSprite("tool_sprite") }
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
