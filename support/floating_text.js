export default class FloatingText {
  static objs = []

  constructor(ctx, opts) {
    this.ctx = ctx
    this.opts = opts || {}

    this.x = this.opts.x || 0
    this.x = this.opts.y || 0
    this.constructor.objs.push(this)
    this.text = this.opts.text
    this.text_obj = this.ctx.add.text(16, 16, this.opts.text, { font: "monospace" }).setDepth(10000)
  }

  setText(new_text) {
    this.text = new_text || ""
    this.draw()
  }

  draw() {
    this.text_obj.setText(this.text)
  }
}
