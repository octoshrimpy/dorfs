import BaseJob from "./base_job.js"
// import Field from "../../resources/field.js"

export default class Builder extends BaseJob {
  static push = BaseJob.jobs.push(this)
  static sprite = "alives.dorfs.builder"
  // static tool = "tools.scythe"

  static workSite() {
    // return Field
  }
}
