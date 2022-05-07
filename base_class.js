export default class BaseClass {
  static global_objs = []

  constructor(ctx, opts, sprite_path) {
    this.ctx = ctx
    this.opts = opts || {}

    this.sprite_path = sprite_path || "placeholder"
    this.sprite = this.setSprite(this.sprite_path)
    this.sprite.depth = this.sprite.y
    this.constructor.global_objs.push(this)
  }

  setSprite(sprite_str) {
    let sprite = this.ctx.addSpriteWithAnim(sprite_str, this.opts)
    sprite.name = sprite_str
    this.sprite_anims = Object.keys(sprite.anims.animationManager.anims.entries)
    var self = this
    sprite.setInteractive().on("pointerdown", function() { self.clicked() })

    return sprite
  }

  clicked() {
    if (this.ctx.selected) { this.ctx.selected.selected = false } // Unselect the previous selected

    this.ctx.selected = this
    this.selected = true
    console.log(this)
  }

  inspect() {
    return this.constructor.name
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
      obj.tick()
    })
  }

  static all() {
    return this.objs
  }
}
