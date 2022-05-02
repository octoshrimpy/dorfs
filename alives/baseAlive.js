import BaseClass from "../baseClass.js"

export default class BaseAlive extends BaseClass  {
  #baseHealth
  #baseMoveSpeed

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    opts = opts || {}
  }
}
