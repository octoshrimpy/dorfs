export default class BaseItem {
  constructor(opts) {
    this.opts = opts || {}

    this.name = opts.name || "item"
    this.weight = opts.weight || 1
    this.count = opts.count || 0
  }

  totalWeight() {
    return this.weight * this.count
  }
}
