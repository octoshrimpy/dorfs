import BaseObject from "../../base_object.js"

export default class Corpse extends BaseObject {
  static objs = []

  constructor(villager) {
    super(villager.ctx, { x: villager.sprite.x, y: villager.sprite.y }, villager.sprite_path || "alives.dorfs.adult")
    this.ctx = villager.ctx
    this.name = villager.name
    this.cause = villager.cause_of_death

    this.sprite.rotation = 80
  }

  inspect() {
    return [
      "Corpse of " + this.name,
      "Cause of death: " + this.cause
    ]
  }
}
