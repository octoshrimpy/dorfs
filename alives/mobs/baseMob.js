import BaseAlive from "../baseAlive.js"

export default class BaseHumanoid extends BaseAlive {
  #baseHealth = 20

  constructor(ctx, opts) {
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}
  }
}
