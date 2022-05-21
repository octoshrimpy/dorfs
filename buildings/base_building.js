import BaseClass from "../base_class.js"
import { scaleX, scaleY } from "/helpers.js"

export default class BaseBuilding extends BaseClass {
  constructor(ctx, opts, sprite_path) {
    super(ctx, opts, sprite_path)
    this.ctx = ctx
    this.opts = opts || {}
  }

  setSprite(sprite_str) {
    let sprite = super.setSprite(sprite_str)

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
    this.access_origin = { x: sprite.x, y: sprite.y + sprite.height/2 }
    sprite.depth = this.access_origin.y

    var circle = this.ctx.env.add.circle(this.access_origin.x, this.access_origin.y, 2, 0xFF0000)
    circle.depth = sprite.depth

    return sprite
  }
}
