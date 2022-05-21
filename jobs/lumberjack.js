import BaseJob from "./base_job.js"
import Tree from "../../resources/tree.js"

export default class Lumberjack extends BaseJob {
  static push = BaseJob.jobs.push(this)
  static sprite = "alives.dorfs.lumberjack"
  static tool = "tools.axe"

  static workSite() {
    return Tree
  }
}
