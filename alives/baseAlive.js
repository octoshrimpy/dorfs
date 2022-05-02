import BaseClass from "../baseClass.js"

export default class BaseAlive extends BaseClass  {
  #baseHealth
  #baseMoveSpeed
  
  constructor(ctx, opts) {
    super(ctx)
    this.ctx = ctx
    opts = opts || {}
  }
}
