import BaseObject from "../base_object.js"
import Item from "../items/item.js"
import { scaleVal, scaleX, scaleY } from "/helpers.js"

export default class BaseResource extends BaseObject {
  static nearest(x1, y1) {
    let with_resources = this.objs.filter(function(obj) {
      return obj.resources > 0 && obj.collector == undefined
    })
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

  static newItem() {
    return new Item(this.item)
  }

  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}

    this.x = this.opts.x
    this.y = this.opts.y

    this.collector = undefined

    // factor is num of resources per sec
    this.min_collect_factor = 10 // per sec
    this.max_collect_factor = 0.5 // per sec
    this.resources = 100
    this.item = this.constructor.item
    this.constructor.objs.push(this)
  }

  inspect() {
    return [
      this.constructor.name,
      "Resources: " + this.resources
    ]
  }

  collect() {
    this.resources -= 1
    if (this.resources <= 0) {
      this.remove()
    }
  }

  setSprite(sprite_str) {
    let sprite = super.setSprite(sprite_str)
    let self = this
    sprite.setInteractive().on("pointerdown", function(pointer) {
      if (pointer.rightButtonDown()) { self.remove() }
    })

    let alignToGrid = function(val, size, scale, origin_multiplier) {
      let origin_offset = size * origin_multiplier
      val += origin_offset
      let aligned = Math.round(val / scale) * scale
      let variance = Math.random() - 0.5

      return aligned + variance - origin_offset
    }
    sprite.x = alignToGrid(sprite.x, sprite.width, scaleX(1), sprite.originX)
    sprite.y = alignToGrid(sprite.y, sprite.height, scaleY(0.5), sprite.originY)
    // Access Origin should be the "base" of the sprite.
    // Take the "y" (center point of sprite) and add half of the sprite height to align to the base.
    // Add half of a scaleY (1 cell) so that the depth aligns with the center point of the bottom cell.
    this.access_origin = { x: sprite.x, y: sprite.y + sprite.height/2 - scaleY(0.5) }
    sprite.depth = this.access_origin.y

    // var circle = this.ctx.env.add.circle(this.access_origin.x, this.access_origin.y, 2, 0xFF0000)
    // circle.depth = sprite.depth

    return sprite
  }
}
