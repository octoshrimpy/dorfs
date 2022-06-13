export default class FloatingText {
  static objs = []

  constructor(opts) {
    this.opts = opts || {}

    this.x = this.opts.x || 16
    this.y = this.opts.y || 16
    this.constructor.objs.push(this)
    this.text = this.opts.text || {}

    // this is for font
    // used https://yal.cc/r/20/pixelfont/ to convert aseprite font into ttf, use json files
    this.text_obj = window.ctx.env.add.text(16, 16, "", {fontFamily: "kerriefont-mono", fontSize: 16})
    this.text_obj.setDepth(10000) // Super high Z index
    this.text_obj.setResolution(3) // this makes the font clearer to read
    this.text_obj.setShadow(-4, 4, 'rgba(0,0,0)', 0)
    this.text_obj.setPadding(32) // needed so the shadow above doesn't get cut off
  }

  setText(new_text) {
    this.text = new_text || ""
    this.draw()
  }

  draw() {
    this.text_obj.setText(this.text)
  }
}
