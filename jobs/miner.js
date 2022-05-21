import BaseJob from "./base_job.js"
import Rock from "../../resources/rock.js"

export default class Miner extends BaseJob {
  static push = BaseJob.jobs.push(this)
  static sprite = "alives.dorfs.miner"
  static tool = "tools.pick"

  static workSite() {
    return Rock
  }
}
