export default class FloatingText {
  static objs = []

  constructor(ctx, opts) {
    this.ctx = ctx
    this.opts = opts || {}

    this.x = this.opts.x || 16
    this.y = this.opts.y || 16
    this.constructor.objs.push(this)
    this.text = this.opts.text

    // this is for bitmap font
    this.text_obj = this.ctx.add.bitmapText(this.x, this.y, "dorfscratch", this.opts.text)
    this.text_obj.setDepth(10000) // Super high Z index
    this.text_obj.setScale(0.5) // 1 is default, 2 is twice the size
  }

  setText(new_text) {
    this.text = new_text || ""
    this.draw()
  }

  draw() {
    this.text_obj.setText(this.text)
  }
}
