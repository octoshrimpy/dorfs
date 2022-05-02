export default class BaseClass {

  constructor(ctx, opts, sprite_path) {
    this.ctx = ctx
    this.opts = opts || {}

    this.sprite_path = sprite_path || "placeholder"
    this.sprite = this.setSprite.call(this, this.sprite_path)
  }

  setSprite(spriteStr) {
    let sprite = this.ctx.addSpriteAnim(this.opts.x, this.opts.y, spriteStr).setDepth(1)
    sprite.name = spriteStr

    return sprite
  }

  // Class method
  static tick() {
    this.objs.forEach(function(obj) {
      obj.tick()
    })
  }

  static all() {
    return this.objs
  }
}
