import BaseResource from "./base_resource.js"

export default class Storage extends BaseResource {
  static objs = []

  constructor(opts, sprite_path) {
    super(opts, sprite_path || "things.chest")
    this.opts = opts || {}

    this.inventory = {}
  }

  inspect() {
    return [
      "Storage",
      ...Object.entries(this.inventory).filter(function([_name, item]) {
        return item.count > 0
      }).map(function([name, item]) {
        return name + ": " + item.count + " (" + item.totalWeight() + " lbs)"
      })
    ]
  }

  available() {
    return true
  }
}
