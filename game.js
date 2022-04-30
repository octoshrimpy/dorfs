import Villager from "/villager/villager.js"
import Tree from "/resources/tree.js"
import Rock from "/resources/rock.js"
import Cow from "/mobs/cow.js"
import Storage from "/resources/storage.js"
import { rand, scaleVal, scaleX, scaleY, weightedList, mapTimes, byWeight, idxFromPos, sample } from "/helpers.js"

var map_w = 45, map_h = 23
var config = {
  type: Phaser.AUTO,
  width: scaleX(map_w),
  height: scaleY(map_h),
  scale: {
    zoom: 1.5,
  },
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

  // this.load.spritesheet("map", "assets/tiles/map/basictiles.png", { frameWidth: 16, frameHeight: 16 })
  this.load.spritesheet("slime", "assets/sprites/slimes/Slime_Medium_Blue.png", { frameWidth: 32, frameHeight: 32 })
  this.load.spritesheet("master", "assets/master.png", { frameWidth: 16, frameHeight: 16 })

  //TODO: extract to its own json file. this.load.json("path.json")
  ctx.sprites = {
    ground: {
      grass: { base: { start: [26, 0], length: 4 } },
    },
    things: {
      rock: { base: { start: [0, 1], length: 2 } },
      iron_ore: { base: { start: [0, 0], length: 2 } },
      stump: { base: { start: [0, 2], length: 2 } },
      chest: { base: { start: [21, 0], length: 2 } },
      sign: { base: { start: [22, 0], length: 2 } },
    },
    alives: {
      dorfs: {
        child: {
          stand: [10, 1],
          walk: { start: [11, 1], length: 2 }
        },
        adult: {
          stand: [10, 0],
          walk: { start: [11, 0], length: 2, speed: 5 }
        },
        old: {
          stand: [10, 0],
          walk: { start: [11, 0], length: 2 },
          addons:{
            beard_silver: [13, 0]
          }
        },
        senile: {
          stand: [10, 0],
          walk: { start: [11, 0], length: 2 },
          addons: {
            beard_white: [13, 1]
          }
        },
        ghost: {
          idle: { start: [10, 2], length: 2 },
          haunt: { start: [12, 2], length: 2 }
        }
      },
      animals: {
        cow: {
          stand: [10, 4]
        }
      }
    }
  }

  ctx.addSpriteAnim = function(x, y, sprite_path) {
    var obj = sprite_path.split(".").reduce(function(full, key) { return full[key] }, ctx.sprites)
    for (let [key, anims] of Object.entries(obj)) {
      if (Array.isArray(anims)) { anims = { start: anims, length: 1 } }

      var frames = mapTimes(anims.length, function(t) {
        return idxFromPos(32, anims.start[0] + t, anims.start[1])
      })

      anims.start.forEach(function(anim) {
        ctx.env.anims.create({
          key: sprite_path + "." + key,
          frames: ctx.env.anims.generateFrameNumbers("master", { frames: frames }),
          frameRate: anims.speed || 10,
          repeat: -1
        })
      })
    }

    var first = obj[Object.keys(obj)[0]]
    if (!Array.isArray(first)) { first = first.start }
    var frame = idxFromPos(32, ...first)

    return ctx.env.add.sprite(x, y, "master", frame)
  }
}

function create() {
  world = generate_map(this)

  ctx.world = world

  mapTimes(10, function() {
    new Villager(ctx, { x: rand(32, config.width - 32), y: rand(32, config.height - 32) })
  })

  mapTimes(3, function() {
    new Tree(ctx, { x: rand(32, config.width - 32), y: rand(32, config.height - 32) })
  })

  mapTimes(3, function() {
    new Cow(ctx, { x: rand(32, config.width - 32), y: rand(32, config.height - 32) })
  })

  mapTimes(4, function() {
    new Rock(ctx, { x: rand(32, config.width - 32), y: rand(32, config.height - 32) })
  })

  new Storage(ctx, { x: rand(32, config.width - 32), y: rand(32, config.height - 32) })
}

function update() { // ~60fps
  Villager.tick()
  Cow.tick()
}

function generate_map(ctx) {
  let flat_grass = idxFromPos(32, 25, 0), short_grass = idxFromPos(32, 26, 0), flowers = idxFromPos(32, 27, 0), long_grass = idxFromPos(32, 28, 0)
  let weights = weightedList([flat_grass, 500], [short_grass, 100], [long_grass, 50], [flowers, 1])

  let level = mapTimes(map_h, function(y) {
    return mapTimes(map_w, function(x) {
      // if (x == 0 || x == map_w - 1 || y == 0 || y == map_h - 1) {
      //   return idxFromPos(11, 3)
      // } else {
        return sample(weights)
      // }
    })
  })

  var map = ctx.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 })
  var tiles = map.addTilesetImage("master")
  var layer = map.createLayer(0, tiles, 0, 0)
  return map
}
