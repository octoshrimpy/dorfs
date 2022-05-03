import BaseAlive from "../base_alive.js"

export default class BaseHumanoid extends BaseAlive {
  #baseHealth = 20

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}
  }
}
