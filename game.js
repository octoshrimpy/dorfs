import Villager from "/villager/villager.js"
import Tree from "/resources/tree.js"
import Rock from "/resources/rock.js"
import Storage from "/resources/storage.js"
import { scaleX, scaleY, weightedList, mapTimes, byWeight, idxFromPos, sample } from "/helpers.js"

var map_w = 51, map_h = 31
var config = {
  type: Phaser.AUTO,
  width: scaleX(map_w),
  height: scaleY(map_h),
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config)
var ctx
var world

function preload() {
  ctx = {
    env: this,
    game: game,
  }

  this.load.spritesheet("map", "assets/tiles/map/basictiles.png", { frameWidth: 16, frameHeight: 16 })
  this.load.spritesheet("slime", "assets/sprites/slimes/Slime_Medium_Blue.png", { frameWidth: 32, frameHeight: 32 })
  this.load.spritesheet('master', "assets/sprites/master.png", {frameWidth: 512, frameHeight: 512})
}

function create() {
  world = generate_map(this)

  ctx.world = world
  ctx.sprites = {
    things: {
      rock: [0,1],
      iron_ore: [0,0],
      stump: [0,3],
      chest: [21,0],
      sign: [23,0],
    },
    alives: {
      dorfs:{
        dorf: [10,0],
        dorf_walk: [[11,0],[12,0]],
        dorf_child: [10,1],
        dorf_child_walk: [[11,1],[12,1]],
        dorf_addon_silver: [13,0],
        dorf_addon_white: [13,1],
        dorf_ghost: [[10,2],[11,2]],
        dorf_ghost_haunt: [[12,2],[13,2]],
      },
      animals: {
        cow: [10,4]
      }
    }
  }

  new Villager(ctx, { x: Math.random() * config.width, y: Math.random() * config.height })
  new Villager(ctx, { x: Math.random() * config.width, y: Math.random() * config.height })
  new Villager(ctx, { x: scaleX(8), y: scaleY(25) })

  new Tree(ctx, { x: scaleX(8), y: scaleY(25) })
  new Rock(ctx, { x: scaleX(40), y: scaleY(22) })
  new Storage(ctx, { x: config.width/2, y: config.height/2 })
}

function update() { // ~60fps
  Villager.tick()
}

function generate_map(ctx) {
  let flat_grass = idxFromPos(10, 8), short_grass = idxFromPos(10, 9), flowers = idxFromPos(11, 8), long_grass = idxFromPos(11, 9)
  let weights = weightedList([flat_grass, 500], [short_grass, 100], [long_grass, 50], [flowers, 1])

  let level = mapTimes(map_h, function(y) {
    return mapTimes(map_w, function(x) {
      if (x == 0 || x == map_w - 1 || y == 0 || y == map_h - 1) {
        return idxFromPos(11, 3)
      } else {
        return sample(weights)
      }
    })
  })

  var map = ctx.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 })
  var tiles = map.addTilesetImage("map")
  var layer = map.createLayer(0, tiles, 0, 0)
  return map
}
