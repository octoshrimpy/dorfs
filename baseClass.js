export default class BaseClass {
  constructor() {
    this.sprite = ctx.addSpriteAnim(opts.x, opts.y, "placeholder").setDepth(1)
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
