import BaseAlive from "../baseAlive.js"

export default class BaseHumanoid extends BaseAlive {
  #baseHealth = 50
  #baseInventorySlots = 1
  #inventory = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}
  }
}
