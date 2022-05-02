export default class BaseClass {

  constructor(ctx, opts, sprite_path) {
    this.ctx = ctx
    this.opts = opts || {}

    this.sprite_path = sprite_path || "placeholder"
    this.sprite = this.setSprite(this.sprite_path)

    this.setDepth(this.sprite.y)
  }


  setSprite(spriteStr) {
    let sprite = this.ctx.addSpriteAnim(this.opts.x, this.opts.y, spriteStr).setDepth(1)
    sprite.name = spriteStr
    this.sprite_anims = Object.keys(sprite.anims.animationManager.anims.entries)

    return sprite
  }

  setDepth(depth){
    this.depth = depth + 64;
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
