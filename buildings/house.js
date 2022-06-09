import BaseWorkshop from "./base_workshop.js"

export default class House extends BaseWorkshop {
  static objs = []
  static well_rested = 85
  static rest_ratio = 20 // @think vs craft_ratio??

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path || "buildings.house")
    this.ctx = ctx
    this.opts = opts || {}

    this.min_rest_factor = 0.1
    this.max_rest_factor = 0.5
    
    this.capacity = 2
    this.tenants = []
  }

  inspect() {
    return [
      this.constructor.name,
      "Sleeping Dorfs: ", this.tenants.map(function(tenant) { return tenant.name }).join(", "),
    ]
  }

  isFull() {
    return this.tenants.length >= this.capacity
  }

  add(dorf) {
    if (!this.tenants.includes(dorf)) { this.tenants.push(dorf) }
  }

  remove(dorf) {
    this.tenants = this.tenants.filter(function(tenant) {
      return tenant != dorf
    })
  }
}
