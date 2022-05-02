import { scaleVal } from "/helpers.js"
import BaseClass from "../baseClass.js"

export default class BaseResource extends BaseClass {

  constructor(ctx, opts) {
    super(ctx)
    this.ctx = ctx
    opts = opts || {}

    // factor is num of resources per sec
    this.min_collect_factor = 10 // per sec
    this.max_collect_factor = 0.5 // per sec
  }

  static nearest(x1, y1) {
    return this.objs.map(function(obj) {
      let x2 = obj.sprite.x, y2 = obj.sprite.y

      return [Math.abs(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)), obj]
    }).sort(function(a, b) {
      return b[0] - a[0]
    })[0][1]
  }
}
