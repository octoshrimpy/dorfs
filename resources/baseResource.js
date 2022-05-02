import BaseClass from "../baseClass.js"
import { scaleVal, scaleX, scaleY } from "/helpers.js"

export default class BaseResource extends BaseClass {

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}

    // factor is num of resources per sec
    this.min_collect_factor = 10 // per sec
    this.max_collect_factor = 0.5 // per sec
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
    sprite.y = alignToGrid(sprite.y, sprite.height, scaleY(1), sprite.originY)=

    return sprite
  }

  static nearest(x1, y1) {
    return this.objs.map(function(obj) {
      let x2 = obj.sprite.x, y2 = obj.sprite.y
      let dist = Math.abs(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2))

      return [dist, obj]
    }).sort(function(a, b) {
      return a[0] - b[0]
    })[0][1]
  }
}
