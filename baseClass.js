export default class BaseClass {

  constructor(ctx, opts) {
    this.ctx = ctx
    opts = opts || {}
    this.opts = opts

    this.sprite = this.setSprite.call(this, "placeholder")
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
