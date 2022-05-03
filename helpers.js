var fps = 60

export function scaleX(n) { return n * 16 }
export function scaleY(n) { return n * 16 }

export function weightedList() {
  return Array.from(arguments).map(function(arg) {
    return byWeight(arg[0], arg[1])
  }).flat()
}

// multiplier is the multiple of how much more common the center is than the outsides
export function normalDist(min, max, multiplier=3, bias=null) {
  bias = bias || ((max - min) / 2)
  let weighted_values = times(multiplier, function() { return rand(min, max) })
  let norm = weighted_values.sort(function(a, b) { return Math.abs(a - bias) - Math.abs(b - bias) })[0]
  let mix = rand()

  return Math.round((norm * (1 - mix)) + (bias * mix))
}

export function times(times, fn) {
  return Array(times).fill().map(function(_, idx) {
    return fn(idx)
  })
}

export function byWeight(obj, weight) {
  return times(weight, function() { return obj })
}

export function idxFromPos(x, y, sheet_cells_horz = 32) {
  // 0 based pos
  return (y * sheet_cells_horz) + x
}

export function sum(arr) {
  return arr.reduce(function(aggr, i) { return aggr + i }, 0)
}

export function sample(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

export function rand(min, max) {
  if (!min) { return Math.random() }
  if (!max) {
    max = min
    min = 0
  } else {
    max += 1
  }

  return Math.floor(rand() * (max - min) + min)
}

export function randOnePerNSec(n) {
  return rand(fps * n)
}

export function randNPerSec(n) {
  return rand(fps / n)
}

export function scaleVal(value, f1, f2, t1, t2) {
  var tr = t2 - t1
  var fr = f2 - f1

  return (value - f1) * tr / fr + t1
}
