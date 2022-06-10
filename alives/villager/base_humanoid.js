import BaseAlive from "../base_alive.js"

export default class BaseHumanoid extends BaseAlive {
  // #baseHealth = 50
  // #baseInventorySlots = 1
  // #inventory = []

  constructor(opts, sprite_path) {
    super(opts, sprite_path)
    this.opts = opts || {}
  }
}
