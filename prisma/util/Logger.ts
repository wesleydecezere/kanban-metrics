import type { ChalkInstance } from "chalk"
import moment from "moment"

export class ProcessLogger {
  label: string

  constructor(name: string, color: ChalkInstance) {
    this.label = color(name)
  }

  start() {
    performance.mark("start")
    console.info(this.label, "Starting process...")
  }

  end() {
    const duration = performance.measure("p", "start").duration
    const milis = moment(duration).format("SSS")
    console.info(this.label, `Finished in ${milis} ms.`)
  }

  error(error?: Error) {
    console.error(
      this.label,
      `${this.label} Process finished with error!`,
      error?.message,
    )
  }
}
