import BaseAlive from "../base_alive.js"
import { randPerNSec } from "../../helpers.js"

export default class BaseHumanoid extends BaseAlive {
  // #baseHealth = 20

  constructor(opts, sprite_path) {
    super(opts, sprite_path)
    this.opts = opts || {}
  }

  tick() {
    if (!this.scared && randPerNSec(this.wander_scale || 10)) {
      this.wander()
    }

    this.moveTowardsDest()
  }
}
