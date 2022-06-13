import { randCoord, coordToCard, cardToCoord } from "../helpers.js"

export default class BaseObject {
  static global_objs = []

  static clearRemoved() {
    this.objs = this.objs.filter(function(obj) {
      return !!obj.sprite
    })
    this.global_objs = this.global_objs.filter(function(obj) {
      return !!obj.sprite
    })
  }

  constructor(opts, sprite_path) {
    this.opts = opts || {}

    this.setSprite(sprite_path)
    this.constructor.global_objs.push(this)
  }

  setCardinal() {
    this.feet = { x: this.sprite.x, y: this.sprite.y + (this.sprite.height/2) - 1 }
    this.x = this.feet.x
    this.y = this.feet.y

    let cardinal = coordToCard(this.x, this.y)
    this.cx = cardinal.x
    this.cy = cardinal.y
  }

  setSprite(sprite_str) {
    sprite_str = sprite_str || "placeholder"
    this.sprite_path = sprite_str
    let old_sprite = this.sprite
    let sprite_opts = this.opts
    if (!sprite_opts.x && !sprite_opts.y) {
      sprite_opts = { ...sprite_opts, ...randCoord() }
    }
    if (old_sprite) {
      if (this.access_origin) {
        sprite_opts.x = this.access_origin.x
        sprite_opts.y = this.access_origin.y
      } else {
        sprite_opts.x = old_sprite.x
        sprite_opts.y = old_sprite.y
      }
      old_sprite.destroy(true)
    }
    let new_sprite = ctx.addSpriteWithAnim(sprite_str, sprite_opts)
    new_sprite.name = sprite_str
    this.sprite_anims = Object.keys(new_sprite.anims.animationManager.anims.entries)
    let self = this
    new_sprite.setInteractive().on("pointerdown", function() { self.clicked() })
    this.sprite = new_sprite
    this.depth = this.sprite.y + this.sprite.height/2
    this.setCardinal()

    return new_sprite
  }

  remove() {
    if (ctx.selected == this) {
      ctx.selected = undefined
      this.selected = false
    }
    this.removed = true
    this.clearSprite()
    this.constructor.clearRemoved()
  }

  clicked() {
    if (this.removed) { return }
    if (ctx.selected) { ctx.selected.selected = false } // Unselect the previous selected

    ctx.selected = this
    this.selected = true
    console.log(this)
  }

  inspect() {
    return [this.constructor.name]
  }

  clearSprite() {
    this.sprite?.destroy(true)
    this.sprite = undefined
  }

  spriteHasAnim(anim) {
    return this.sprite_anims.includes([this.sprite_path, anim].join("."))
  }

  loopAnim(anim) {
    let continue_anim_if_already_playing = true
    this.sprite.anims.play([this.sprite_path, anim].join("."), continue_anim_if_already_playing)
  }

  stopAnim() {
    this.sprite.anims.stop(null)
  }

  tick() {
    // No op - should be overridden in child methods
  }

  // Class method
  static tick() {
    this.global_objs.forEach(function(obj) {
      // let circle = ctx.env.add.circle(this.access_origin.x, this.access_origin.y, 2, 0xFF0000)
      // circle.depth = sprite.depth
      obj.tick()
      obj.tracker = obj.tracker || ctx.env.add.polygon(obj.x, obj.y, "0 0 0 16 16 16 16 0", 0xFF0000, 0.2)
      // Polygon x,y are the center of the polygon
      obj.tracker.x = cardToCoord(obj.cx) + 8
      obj.tracker.y = cardToCoord(obj.cy) + 8
      if (obj.removed) {
        obj.tracker.destroy(true)
        obj.tracker = undefined
      }
    })
  }

  static all() {
    return this.objs
  }
}
