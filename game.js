import BaseObject    from "./base_object.js"
import Villager     from "./alives/villager/villager.js"

/* eslint-disable no-unused-vars */
// We have to initialize these classes here so that they are accessible by the BaseJob
import Baker        from "./jobs/baker.js"
import Builder      from "./jobs/builder.js"
import Farmer       from "./jobs/farmer.js"
import Lumberjack   from "./jobs/lumberjack.js"
import Operator     from "./jobs/operator.js"
import Miner        from "./jobs/digger.js"
import Smith        from "./jobs/smith.js"
/* eslint-enable no-unused-vars */

import Tree         from "./resources/tree.js"
import Rock         from "./resources/rock.js"
import Field        from "./resources/field.js"

import Cow          from "./alives/mobs/cow.js"
import Chicken      from "./alives/mobs/chicken.js"

import Storage      from "./resources/storage.js"

import Bakery       from "./buildings/bakery.js"
import House        from "./buildings/house.js"
import Quarry       from "./buildings/quarry.js"

import FloatingText from "./support/floating_text.js"

import {
  rand,
  normalDist,
  randPerNSec,
  scaleX,
  scaleY,
  weightedList,
  times,
  idxFromPos,
  sample,
  randCoord,
  constrain
} from "./helpers.js"

let Phaser = window.Phaser

let map_w = 45, map_h = 23
let config = {
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

window.ctx = {
  game: new Phaser.Game(config)
}

function preload() {
  this.load.json("names", "data/names.json")
  this.load.json("sprites", "data/sprites.json")
  this.load.spritesheet(
    "slime",
    "assets/sprites/slimes/Slime_Medium_Blue.png",
    { frameWidth: 32, frameHeight: 32 }
  )
  this.load.spritesheet(
    "master",
    "assets/master.png",
    { frameWidth: 16, frameHeight: 16 }
  )
  this.load.spritesheet(
    "big_master",
    "assets/big_master.png",
    { frameWidth: 32, frameHeight: 32 }
  )
  this.load.spritesheet(
    "big_master2x3",
    "assets/bigmaster2x3.png",
    { frameWidth: 32, frameHeight: 48 }
  )
  this.load.bitmapFont(
    "dorfscratch",
    "assets/fonts/dorfscratch-Regular.png",
    "assets/fonts/dorfscratch-Regular.fnt"
  )
  // Add some custom function to take the hard width of sprites, which are always 1x1 ratio and
  //   then centers the origin

  this.input.mouse.disableContextMenu()
}

function create() {
  ctx.env = this
  setupContext()
  setupControls()
  ctx.world = generate_map(ctx.sprites)

  // new Villager({ walk_speed: 70 })
  times(10, function() {
    new Villager()
  })

  times(3, function() {
    new Tree()
  })

  times(1, function() {
    new Rock()
  })

  times(5, function() {
    new Cow()
  })

  times(10, function() {
    new Chicken()
  })

  times(normalDist(2, 5), function() {
    let horz = normalDist(1, 10, 4, 4) // min, max, mult, bias
    let vert = normalDist(1, 10, 4, 4)
    let start = randCoord()

    times(horz, function(x_idx) {
      times(vert, function(y_idx) {
        new Field({ x: start.x + (x_idx * scaleX(1)), y: start.y + (y_idx * scaleY(0.5))})
      })
    })
  })

  let midpoint = { x: config.width/2, y: config.height/2 }
  let storage = new Storage({ x: midpoint.x, y: midpoint.y })
  // storage.inventory.wheat = Field.newItem()
  // storage.inventory.wheat.count = 100
  storage.clicked()
  new Bakery({ x: midpoint.x - (5 * 16), y: 32 })
  new House({ x: midpoint.x - (15 * 16), y: 32 })
  new Quarry({ x: midpoint.x + (15 * 16), y: 32 })
}

function update() { // ~60fps
  BaseObject.tick()

  if (randPerNSec(80) && Tree.objs.length < 10) { new Tree() }

  if (ctx.selected?.removed) { ctx.selected = undefined }
  ctx.overlay.setText([
    ...(ctx.selected?.inspect() || []),
    ...[null],
    ...Villager.objs.map(function(villager) {
      let length = 23
      let fullness = villager.fullness
      let whitespace = " ".repeat(length - villager.name.length - fullness.toString().length)
      return villager.name + ":" + whitespace + fullness + " | " + villager.energy
    })
  ])
}

function setupControls() {
  let speed_constraints = [1, 10]
  let speed_increment = 1

  let arrows = ctx.env.input.keyboard.createCursorKeys()

  arrows.left.on("down", function(evt) {
    let new_speed = constrain(ctx.game.speed - speed_increment, ...speed_constraints)
    ctx.game.speed = new_speed
  })
  arrows.right.on("down", function(evt) {
    let new_speed = constrain(ctx.game.speed + speed_increment, ...speed_constraints)
    ctx.game.speed = new_speed
  })
}

function setupContext() {
  ctx.game.speed = 1
  ctx.sprites = ctx.env.cache.json.get("sprites")
  ctx.overlay = new FloatingText()

  ctx.addSpriteWithAnim = function(sprite_path, opts) {
    let obj
    try {
      // Catch any error here and just render `placeholder` if it fails
      obj = sprite_path.split(".").reduce(function(full, key) { return full[key] }, ctx.sprites)
    } catch(e) {
      // no-op
    }
    if (!obj) { return ctx.addSpriteWithAnim("placeholder", opts) }
    let first_anim = obj[Object.keys(obj)[0]]
    let sheet_name = first_anim.sheet || "master"
    let cell_size = ctx.env.game.textures.list[sheet_name].frames[0].width
    let sheet_width = ctx.env.game.textures.list[sheet_name].source[0].width
    let sheet_cells_horz = sheet_width / cell_size

    for (let [key, anims] of Object.entries(obj)) {
      if (Array.isArray(anims)) { anims = { start: anims, length: 1 } }

      let frames = times(anims.length, function(t) {
        return idxFromPos(anims.start[0] + t, anims.start[1], sheet_cells_horz)
      })

      if (anims.length > 1) {
        anims.start.forEach(function() {
          ctx.env.anims.create({
            key: sprite_path + "." + key,
            frames: ctx.env.anims.generateFrameNumbers(sheet_name, { frames: frames }),
            frameRate: anims.speed || 10,
            repeat: -1
          })
        })
      }
    }

    if (!Array.isArray(first_anim)) { first_anim = first_anim.start }
    let frame = idxFromPos(...first_anim, sheet_cells_horz)

    return ctx.env.add.sprite(opts.x, opts.y, sheet_name, frame)
  }
}

function generate_map(sprites) {
  let flat_grass = idxFromPos(...sprites.ground.grass.flat)
  let short_grass = idxFromPos(...sprites.ground.grass.short)
  let long_grass = idxFromPos(...sprites.ground.grass.long)
  let flowers = idxFromPos(...sprites.ground.grass.flowers)
  let weights = weightedList([flat_grass, 500], [short_grass, 100], [long_grass, 50], [flowers, 1])

  let level = times(map_h, function() {
    return times(map_w, function() {
      return sample(weights)
    })
  })

  let map = ctx.env.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 })
  let tiles = map.addTilesetImage("master")
  map.createLayer(0, tiles, 0, 0)
  return map
}
