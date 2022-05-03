export default class BaseItem {
  constructor(opts) {
    this.opts = opts || {}

    this.weight = 0
    this.count = 0
  }

  totalWeight() {
    return this.weight * this.count
  }
}
