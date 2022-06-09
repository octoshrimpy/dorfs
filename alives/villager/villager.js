import BaseHumanoid from "./base_humanoid.js"
import Corpse from "./corpse.js"
import Ghost from "./ghost.js"

import BaseJob from "../../jobs/base_job.js"
import Bakery from "../../buildings/bakery.js"
import House from "../../buildings/house.js"

import Item from "../../items/item.js"
import Storage from "../../resources/storage.js"

import {
  sum,
  sample,
  normalDist,
  scaleVal,
  randPerNSec,
  randNPerSec,
  min,
  constrain
} from "../../helpers.js"

let Status = { // Is this against convention?
  bored:      "bored",
  dead:       "dead",

  traveling:  "traveling", // TODO: Actually use this over having the busy status' while moving.

  unloading:  "unloading",
  collecting: "collecting",
  sleeping:   "sleeping",
}

export default class Villager extends BaseHumanoid {
  static objs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "alives.dorfs.adult")
    this.setupEnums()
    this.ctx = ctx
    this.opts = opts || {}

    this.name = function() {
      let name_json = ctx.env.cache.json.get("names")
      return [sample(name_json.first), sample(name_json.last)].join(" ")
    }()

    this.destination = undefined
    this.inventory = {}
    this.walk_speed = opts.walk_speed || normalDist(10, 70, 4) // 0-100
    this.collect_speed = opts.collect_speed || normalDist(10, 70, 4) // 0-100
    this.rest_speed = opts.rest_speed || normalDist(10, 70, 4) // 0-100
    this.carry_capacity = opts.carry_capacity || normalDist(60, 120, 4)
    this.selected = false
    this.highlight = undefined
    this.fullness = normalDist(50, 100, 5, 90)
    this.energy = normalDist(50, 100, 5, 55)
    this.status = Status.bored
    this.busy_block = undefined

    this.selected_resource = undefined
    this.selected_storage = undefined
    this.selected_house = undefined

    this.profession = undefined
    this.takeRandomProfession()
    this.tool_sprite = undefined

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
      this.status,
      ...Object.entries(this.inventory).filter(function([_name, item]) {
        return item.count > 0
      }).map(function([name, item]) {
        return name + ": " + item.count + " (" + item.totalWeight() + " lbs)"
      }),
      // "Destination: " + JSON.stringify(this.destination),
      "Walk Speed: " + this.walk_speed,
      "Collect Speed: " + this.collect_speed,
      "Carry Capacity: " + this.carry_capacity,
      "Fullness: " + this.fullness,
      "Energy: " + this.energy,
    ]
  }

  setupEnums() {
    let self = this
    Object.keys(Status).forEach(function(status) {
      let cap_status = status.replace(/\w/, function(l) { return l.toUpperCase() })
      self["is" + cap_status] = function() {
        return self.status == status
      }
      self["set" + cap_status] = function() {
        self.status = status
      }
    })
  }

  isBusy() {
    return [Status.unloading, Status.collecting, Status.sleeping].includes(this.status)
  }

  finishTask() {
    this.busy_block = undefined
    this.clearDest()
    this.setBored()
  }

  showTool() {
    let tool_path = this.profession?.tool
    if (!tool_path) { return }

    this.tool_sprite = this.ctx.addSpriteWithAnim(tool_path, { x: this.sprite.x, y: this.sprite.y })
    this.tool_sprite.anims.play([tool_path, "base"].join("."), true)
    let sprite_fps = scaleVal(this.collect_speed, 0, 100, 0, 20)
    this.tool_sprite.anims.msPerFrame = 1000 / sprite_fps
  }

  showHighlight() {
    let coords = { x: this.sprite.x, y: this.sprite.y }
    this.highlight = this.ctx.addSpriteWithAnim("tools.highlight", coords)
  }

  hideSprite(sprite) {
    this[sprite]?.destroy(true)
    this[sprite] = undefined
  }

  takeProfession(new_profession) {
    let old_profession = this.profession
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
      this.destination = obj.access_origin
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
    return this.isUnloading() || this.fullInventory()
  }

  shouldEat() {
    if (this.fullness >= 90) { return false } // Already full
    if (!(this.selected_storage.inventory.bread?.count > 0)) { return false } // No food to eat
    if (this.fullness <= 50) { return true } // If hungry, be selfish and eat

    // Hungriest villager gets first dibs
    return min(Villager.objs.map(villager => villager.fullness)) >= this.fullness
  }

  shouldSleep() {
    return this.energy < 100
  }

  shouldFindFood() {
    if (this.isBusy() || this.fullness > 50) { return false }

    let storage = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    this.selected_storage = storage
    return storage.inventory.bread?.count > 0
  }

  shouldFindRest() {
    if (this.isBusy() || this.energy > 50) { return false }

    this.selected_house = this.selected_house || House.nearest(this.sprite.x, this.sprite.y)
    return this.selected_house && !this.selected_house.isFull()
  }

  findDestination() {
    if (this.shouldFindFood()) {
      this.busy_block = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
    } else if (this.shouldUnload()) {
      this.setUnloading()
      this.selected_storage = this.selected_storage || Storage.nearest(this.sprite.x, this.sprite.y)
      this.busy_block = this.selected_storage
    } else if (this.shouldFindRest()) {
      this.selected_house = this.selected_house || House.nearest(this.sprite.x, this.sprite.y)
      this.busy_block = this.selected_house
      this.selected_house.add(this)
    } else {
      if (this.selected_resource?.collector != this || this.selected_resource.removed) {
        this.clearSelectedResource()
      }
      if (!this.selected_resource) {
        this.selected_resource = this.profession?.workSite()?.nearest(this.sprite.x, this.sprite.y)
      }
      this.busy_block = this.selected_resource

      if (this.selected_resource) {
        this.selected_resource.collector = this
      } else if (this.inventoryWeight() > 0) {
        this.setUnloading()
        this.findDestination()
      }
    }
  }

  die(cause) {
    this.setDead()
    this.cause_of_death = cause
    this.clearSelectedResource()
    console.log(this.name + " has died of " + cause)
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

  unloadTo(obj) {
    if (randNPerSec(10)) {
      let [item_name, item] = Object.entries(this.inventory).find(function([_name, item_ref]) {
        return item_ref.count > 0
      }) || []
      if (item_name && this.inventory[item_name].count > 0) {
        obj.inventory[item_name] ||= new Item(item.opts)
        obj.inventory[item_name].count += 1
        this.inventory[item_name].count -= 1
      } else {
        this.finishTask()
        this.chooseProfession()
      }
    }
  }

  collectFrom(obj) {
    if (obj.resources <= 0) {
      this.finishTask()
      this.findDestination()
      return
    }

    if (randPerNSec(25)) { this.fullness -= 1 }
    if (randPerNSec(25)) { this.energy -= 1 }

    this.setCollecting()

    this.prepInventoryForProfession()

    let collectRatePerSec = scaleVal(
      this.collect_speed,
      0, 100,
      obj.min_collect_factor, obj.max_collect_factor
    )
    if (randNPerSec(collectRatePerSec)) {
      if (obj.resources > 0) {
        this.inventory[obj.item.name].count += 1
        obj.collect()
      }
    }
  }

  sleepIn(obj) {
    this.setSleeping()

    let restRatePerSec = scaleVal(this.rest_speed, 0, 100, obj.min_rest_factor, obj.max_rest_factor)
    if (this.energy < 100) {
      if (randNPerSec(restRatePerSec)) {
        this.energy += 1
      }
    }
  }

  clearSelectedResource() {
    if (this.selected_resource && this.selected_resource.collector == this) {
      this.selected_resource.collector = undefined
    }
    this.selected_resource = undefined
  }

  workAtBlock() {
    // TODO: The below tasks should ONLY do the task. Resetting destination and similar logic does
    //   not belong in these functions.
    if (this.busy_block.constructor.name == "Storage") {
      if (this.shouldEat()) {
        this.eatFrom(this.busy_block) // Only eats - Good
      } else {
        this.unloadTo(this.busy_block) // Resets busy after complete - Bad
      }
    } else if (this.busy_block.constructor.name == "House") {
      if (this.shouldSleep()) {
        this.sleepIn(this.busy_block) // Only sleeps - Good
      } else {
        this.busy_block.remove(this)
        this.finishTask()
      }
    } else {
      this.collectFrom(this.busy_block) // Resets after complete - Bad
      if (this.fullInventory()) {
        this.finishTask()
      }
    }
  }

  gotoWork() {
    this.destination = this.busy_block.access_origin

    if (this.energy > 50) {
      this.speed = this.walk_speed
    } else {
      this.speed = constrain(0, this.walk_speed, scaleVal(this.energy, 0, 50, 0, this.walk_speed))
    }
  }

  tick() {
    if (this.isDead()) { return } // Stops next tick from coming back to life
    if (this.fullness <= 0) { return this.die("starvation") }
    if (this.energy <= 0) { return this.die("exhaustion") }
    if (randPerNSec(75)) { this.fullness -= 1 }
    if (!this.isSleeping() && randPerNSec(50)) { this.energy -= 1 }

    if (this.isCollecting() && this.selected_resource?.resources <= 0) {
      this.finishTask()
      this.clearSelectedResource()
    }

    if (this.busy_block && this.arrivedAt(this.busy_block)) {
      this.workAtBlock()
    } else if (this.busy_block) {
      this.destination = this.busy_block.access_origin
    } else {
      this.findDestination()

      if (this.busy_block) {
        this.gotoWork()
      } else {
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
    if (this.isCollecting() && !this.tool_sprite) { this.showTool() }
    if (!this.isCollecting() && this.tool_sprite) { this.hideSprite("tool_sprite") }
    if (this.tool_sprite) { this.followSprite(this.tool_sprite) }

    if (this.selected && !this.highlight) { this.showHighlight() }
    if (!this.selected && this.highlight) { this.hideSprite("highlight") }
    if (this.highlight) { this.followSprite(this.highlight, -1) }
  }
}
