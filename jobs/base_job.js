import { sample } from "/helpers.js"

export default class BaseJob {
  static jobs = []

  static randProf() {
    return sample(this.jobs)
  }

  static profByName(name) {
    return this.jobs.find(function(job) { return job.name == name })
  }
}
