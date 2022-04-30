var fps = 60

export function scaleX(n) { return n * 16 }
export function scaleY(n) { return n * 16 }

export function weightedList() {
  return Array.from(arguments).map(function(arg) {
    return byWeight(arg[0], arg[1])
  }).flat()
}

export function mapTimes(times, fn) {
  return Array(times).fill().map(function(_, idx) {
    return fn(idx)
  })
}

export function byWeight(obj, weight) {
  return mapTimes(weight, function() { return obj })
}

export function idxFromPos(x, y) {
  // 0 based pos
  let tilemap_w = 15, tilemap_h = 11
  return (y * tilemap_w) + x
}

export function sum(arr) {
  return arr.reduce(function(aggr, i) { return aggr + i }, 0)
}

export function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function rand(min, max) {
  if (!max) {
    max = min
    min = 0
  } else {
    max += 1
  }

  return Math.floor(Math.random() * (max - min) + min)
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
