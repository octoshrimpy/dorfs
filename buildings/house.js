import BaseWorkshop from "./baseWorkshop.js"

export default class House extends BaseWorkshop {
  static objs = []
  static well_rested = 85
  static rest_ratio = 20 // @think vs craft_ratio??
  static sleepyDorfs = []

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "buildings.house")
    this.ctx = ctx
    this.opts = opts || {}

    this.min_rest_factor = 0.1
    this.max_rest_factor = 0.5
  }

  inspect() {
    return [
      this.constructor.name,
      "Sleeping Dorfs: ", this.getSleepyDorfs(),
      "Food Storage: ", this.getSorageBread()
    ]
  }

  getSorageBread(){
    return this.connected_storage.inventory.bread?.count || 0
  }

  getSleepyDorfs() {
    return this.constructor.sleepyDorfs || 0
  }

  addDorf(dorf) {

  }

  removeDorf(dorf) {

  }

  isFull() {
    return false
  }

  tick() {
    // if dorf is more rested than x, removeDorf()
    let dorfs = this.getSleepyDorfs()
    dorfs.forEach(dorf => {
      
    })
  }
}