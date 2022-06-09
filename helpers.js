export let speed_multiplier = 10
export let fps = (60 / speed_multiplier)

export function scaleX(n) { return n * 16 }
export function scaleY(n) { return n * 16 }

// Given a list of [item, weight] returns a flat list of the items multiplied by their weight as a
//   large list
// [["this", 2], ["that", 1]]
// Becomes: ["this", "this", "that"]
export function weightedList() {
  return Array.from(arguments).map(function(arg) {
    return times(arg[1], function() { return arg[0] })
  }).flat()
}

export function weightedSample() {
  return sample(weightedList(...Array.from(arguments)))
}

export function sort(arr) {
  return arr.sort(function(a, b) {
    return a - b
  })
}

export function constrain(val, min, max) {
  return sort([val, min, max])[1]
}

// Returns an integer between min and max, inclusive.
// Follows a bell curve- center numbers are `multiplier` times more likely to appear than outsides
// If provided, `bias` will act as the top of the bell curve
export function normalDist(min, max, multiplier=3, bias=null) {
  bias = bias || ((max - min) / 2)
  let weighted_values = times(multiplier, function() { return rand(min, max) })
  let norm = weighted_values.sort(function(a, b) {
    return Math.abs(a - bias) - Math.abs(b - bias)
  })[0]
  let mix = rand()

  return Math.round((norm * (1 - mix)) + (bias * mix))
}

// Runs the `fn` function `count` times, optionally passing the 0-based index as the argument.
// Will return the `return` of each function as an array.
export function times(count, fn) {
  return Array(count).fill().map(function(_, idx) {
    return fn(idx)
  })
}

// Given an x and y for a sprite sheet, returns the index of the sprite.
export function idxFromPos(x, y, sheet_cells_horz = 32) {
  // 0 based pos
  return (y * sheet_cells_horz) + x
}

// Add all integers in an array together
export function sum(arr) {
  return arr.reduce(function(aggr, i) { return aggr + i }, 0)
}

// Get the lowest value from array
export function min(arr) {
  return sort(arr)[0]
}

// Get the highest value from array
export function max(arr) {
  return sort(arr)[arr.length - 1]
}

// Returns a random value from an array
export function sample(arr) {
  return arr[rand(arr.length)]
}

// Returns a random value.
// If no args are given, returns a random float between 0,1
// If one arg is given, returns an integer between 0,arg inclusive
// If two args are given, returns an integer between min,max inclusive
export function rand(min, max) {
  if (!min && !max) { return Math.random() }
  if (!max) {
    max = min
    min = 0
  } else {
    max += 1
  }

  return Math.floor(rand() * (max - min) + min)
}

// Will return `true` approximately once every `n` seconds when called every tick
export function randPerNSec(n) {
  return rand(fps * n) == 0
}

// Will return `true` approximately `n` times every second when called every tick
export function randNPerSec(n) {
  return rand(fps / n) == 0
}

// Will return a function that can be called that will return `true` roughly n times when called
//   every tick
export function fnRandNPerSec(n) {
  return function() { return randNPerSec(n) }
}
export function fnRandPerNSec(n) {
  return function() { return randPerNSec(n) }
}
export function fnRandNPerMin(n) {
  return function() { return randNPerSec(n * 60) }
}
export function fnRandPerNMin(n) {
  return function() { return randPerNSec(n * 60) }
}

// Transforms `value` through a scale.
// `value` is expected to be within f1,f2, and based on it's percentage through those, will return
//   the equivalent between t1,t2
// `value` can be used outside of the given ranges and will be scaled appropriately
export function scaleVal(value, f1, f2, t1, t2) {
  let tr = t2 - t1
  let fr = f2 - f1

  return (value - f1) * tr / fr + t1
}
