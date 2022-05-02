import Villager from "./alives/villager/villager.js"
import Tree from "./resources/tree.js"
import Rock from "./resources/rock.js"
import Cow from "./alives/mobs/cow.js"
import Storage from "./resources/storage.js"
import { rand, scaleVal, scaleX, scaleY, weightedList, times, byWeight, idxFromPos, sample } from "/helpers.js"

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
  this.load.json("names", "data/names.json")
  this.load.json("sprites", "data/sprites.json")
  this.load.spritesheet("slime", "assets/sprites/slimes/Slime_Medium_Blue.png", { frameWidth: 32, frameHeight: 32 })
  this.load.spritesheet("master", "assets/master.png", { frameWidth: 16, frameHeight: 16 })
  this.load.spritesheet("big_master", "assets/big_master.png", { frameWidth: 32, frameHeight: 32 })
}

function create() {
  setupContext(this)
  world = generate_map(this, ctx.sprites)

  ctx.world = world

  var randCoord = function() {
    return { x: rand(32, config.width - 32), y: rand(32, config.height - 32) }
  }

  times(10, function() {
    new Villager(ctx, randCoord())
  })

  times(3, function() {
    new Tree(ctx, randCoord())
  })

  times(3, function() {
    new Cow(ctx, randCoord())
  })

  times(4, function() {
    new Rock(ctx, randCoord())
  })

  new Storage(ctx, randCoord())
}

function update() { // ~60fps
  Villager.tick()
  Cow.tick()
}

function setupContext(env) {
  ctx = {
    env: env,
    game: game,
    sprites: env.cache.json.get("sprites")
  }

  ctx.addSpriteAnim = function(sprite_path, opts) {
    let obj = sprite_path.split(".").reduce(function(full, key) { return full[key] }, ctx.sprites)
    var first_anim = obj[Object.keys(obj)[0]]
    let sheet_name = first_anim.sheet || "master"
    let cell_size = ctx.env.game.textures.list[sheet_name].frames[0].width
    let sheet_width = ctx.env.game.textures.list[sheet_name].source[0].width
    let sheet_cells_horz = sheet_width / cell_size

    for (let [key, anims] of Object.entries(obj)) {
      if (Array.isArray(anims)) { anims = { start: anims, length: 1 } }

      var frames = times(anims.length, function(t) {
        return idxFromPos(anims.start[0] + t, anims.start[1], sheet_cells_horz)
      })

      anims.start.forEach(function(anim) {
        ctx.env.anims.create({
          key: sprite_path + "." + key,
          frames: ctx.env.anims.generateFrameNumbers(sheet_name, { frames: frames }),
          frameRate: anims.speed || 10,
          repeat: -1
        })
      })
    }

    if (!Array.isArray(first_anim)) { first_anim = first_anim.start }
    var frame = idxFromPos(...first_anim, sheet_cells_horz)

    return ctx.env.add.sprite(opts.x, opts.y, sheet_name, frame)
  }
}

function generate_map(ctx, sprites) {
  let flat_grass = idxFromPos(...sprites.ground.grass.flat), short_grass = idxFromPos(...sprites.ground.grass.short), long_grass = idxFromPos(...sprites.ground.grass.long), flowers = idxFromPos(...sprites.ground.grass.flowers)
  let weights = weightedList([flat_grass, 500], [short_grass, 100], [long_grass, 50], [flowers, 1])

  let level = times(map_h, function(y) {
    return times(map_w, function(x) {
      return sample(weights)
    })
  })

  var map = ctx.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 })
  var tiles = map.addTilesetImage("master")
  var layer = map.createLayer(0, tiles, 0, 0)
  return map
}
