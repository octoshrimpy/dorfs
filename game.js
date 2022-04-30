import Villager from "/villager/villager.js"

var map_w = 50, map_h = 30
var config = {
  type: Phaser.AUTO,
  width: map_w * 16,
  height: map_h * 16,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config)
var ctx
var world
// var v
// var chief
// var player, platforms, stars, scoreText, bombs, gameOver
// var score = 0

function preload() {
  this.load.spritesheet("map", "assets/tiles/map/basictiles.png", { frameWidth: 16, frameHeight: 16 })
  this.load.spritesheet("slime", "assets/sprites/slimes/Slime_Medium_Blue.png", { frameWidth: 32, frameHeight: 32 })
}

function create() {
  world = generate_map(this)
  ctx = {
    env: this,
    game: game,
    world: world,
  }
  new Villager(ctx, { x: config.width/2, y: config.height/2 })
  new Villager(ctx, { x: config.width/2, y: config.height/2 })
}

function update() { // ~60fps
  // var cursors = this.input.keyboard.createCursorKeys()
  // chief.tick(cursors)
  Villager.tick()
}

function generate_map(ctx) {
  let flat_grass = idxFromPos(10, 8), short_grass = idxFromPos(10, 9), flowers = idxFromPos(11, 8), long_grass = idxFromPos(11, 9)
  let weights = weightedList([flat_grass, 500], [short_grass, 100], [long_grass, 50], [flowers, 1])

  let level = mapTimes(map_h, function() {
    return mapTimes(map_w, function() {
      return sample(weights)
    })
  })

  var map = ctx.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 })
  var tiles = map.addTilesetImage("map")
  var layer = map.createLayer(0, tiles, 0, 0)
  return map
}

function weightedList() {
  return Array.from(arguments).map(function(arg) {
    return byWeight(arg[0], arg[1])
  }).flat()
}

function mapTimes(times, fn) {
  return Array(times).fill().map(fn)
}

function byWeight(obj, weight) {
  return mapTimes(weight, function() { return obj })
}

function idxFromPos(x, y) {
  // 0 based pos
  let tilemap_w = 15, tilemap_h = 11
  return (y * tilemap_w) + x
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
