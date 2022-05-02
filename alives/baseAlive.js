import BaseClass from "../baseClass.js"

export default class BaseAlive extends BaseClass  {
  #baseHealth
  #baseMoveSpeed
  
  constructor(ctx, opts) {
    super(ctx, opts)
    this.ctx = ctx
    opts = opts || {}
  }
}
