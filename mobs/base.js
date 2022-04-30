export default class Base {
  constructor() {
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
