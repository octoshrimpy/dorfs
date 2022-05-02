import BaseAlive from "../baseAlive.js"

export default class BaseHumanoid extends BaseAlive {
  #baseHealth = 50
  #baseInventorySlots = 1
  #inventory = []
  
  constructor(ctx, opts) {
    super(ctx)
    this.ctx = ctx
    opts = opts || {}
  }
}
