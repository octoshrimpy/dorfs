import BaseJob from "./base_job.js"
import Quarry from "../buildings/quarry.js"

export default class Operator extends BaseJob {
  static push = BaseJob.jobs.push(this)
  static sprite = "alives.dorfs.miner"

  static workSite() {
    return Quarry
  }
}
