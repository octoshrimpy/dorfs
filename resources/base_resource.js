import BaseClass from "../base_class.js"
import { scaleVal, scaleX, scaleY } from "/helpers.js"

export default class BaseResource extends BaseClass {

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}

    // factor is num of resources per sec
    this.min_collect_factor = 10 // per sec
    this.max_collect_factor = 0.5 // per sec
    this.resources = 100
  }

  collect() {
    this.resources -= 1
    if (this.resources <= 0) {
      this.sprite?.destroy(true)
      this.sprite = undefined
    }
  }

  setSprite(sprite_str) {
    let sprite = super.setSprite(sprite_str)

    let alignToGrid = function(val, size, scale, origin_multiplier) {
      let aligned = Math.round(val / scale) * scale
      let variance = Math.random() - 0.5
      let origin_offset = size * origin_multiplier

      return aligned + variance - origin_offset
    }

    sprite.x = alignToGrid(sprite.x, sprite.width, scaleX(1), sprite.originX)
    sprite.y = alignToGrid(sprite.y, sprite.height, scaleY(1), sprite.originY)

    return sprite
  }

  static nearest(x1, y1) {
    let with_resources = this.objs.filter(function(obj) { return obj.resources > 0 })
    let with_dist = with_resources.map(function(obj) {
      let x2 = obj.sprite.x, y2 = obj.sprite.y
      let dist = Math.abs(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2))

      return [dist, obj]
    })
    let sorted = with_dist.sort(function(a, b) {
      return a[0] - b[0]
    })
    if (sorted.length == 0) { return }

    return sorted[0][1]
  }
}
