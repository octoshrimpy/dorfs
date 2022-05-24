import BaseJob from "./base_job.js"
import Bakery from "../../buildings/bakery.js"

export default class Baker extends BaseJob {
  static push = BaseJob.jobs.push(this)
  static sprite = "alives.dorfs.baker"
  // static tool = "tools.scythe"

  static workSite() {
    return Bakery
  }
}
