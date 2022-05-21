import { sample } from "/helpers.js"

export default class BaseJob {
  static jobs = []

  static randProf() {
    return sample(this.jobs)
  }
}
