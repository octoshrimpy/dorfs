# MVP

## Art Needs:

- [ ] :octoshrimpy Create larger (4x5?) font
- [ ] :octoshrimpy Export font as 16x instead of 32x
- [ ] fix building signs, remove pink from doors
- [x] Tents/Houses/Sleepies
- [ ] Each piece of Dorf separate and white-scaled. So pure white, but make the shadows grey
  - @think not necessary with sprite recoloring
  - https://github.com/Colbydude/phaser-3-palette-swapping-example
- [ ] Beard/hair, skin, pants, shirt each as separate full white sprites
  - @think not necessary with sprite recoloring
  - https://github.com/Colbydude/phaser-3-palette-swapping-example
- [ ] Different sprite sheets for trees / 2x3 sprites
- [ ] Maybe have a sprite variation of carrying a sack/backpack when inventory is full?
  - @think not MVP?
- [ ] GUI
  - [ ] Overall (Resources, villager count, babies, villagers per profession...)
    - [ ] mini versions of stuff for UI
      - [ ] child
      - [ ] adult
      - [ ] professions
      - [ ] seasons
      - [ ] tiny inventory item icons
        - [ ] stone
        - [x] wood
        - [x] wheat
        - [x] meat
        - [x] milk
        - [x] honey
        - [x] bread

  - [ ] Game Time (Year? Season?)
  - [ ] Selected (Show stats of clicked dorf, resources for block, storage for item, etc...)
  - [ ] Craft Menu
- [x] Sprite-specific professions
  - [x] Lumberjack
  - [x] Miner
  - [x] Farmer
  - [x] Builder
  - [x] Baker
  - [x] Smith

## old ideas

- add 3 kinds of land
  - infinite resource pool
    - will auto-add to inventory (later might drop on ground for sweeping)
  - storage location
  - recharge station (bed/sleeping/house)
- movement across playable map
  - has to update as new land is added
- task list
  - dorfs can
- sprites
  - buildings
    - House
    - Bakery
    - Smith
  - Resources:
    - Full size Trees
    - Full size Boulders
    - Full size Field/Grasses

---

## V2

- slimes for hire
  - _slime shop when too much to do, costs money instead of food/sleep_
  - money acquired by selling to random wandering traders
  - forge money with gold

## Known Bugs

-

---

## Rocco Notes

- [x] Wheat should grow in patches. Grows over time, can only be harvested once full, the falls back to initial state where it must grow over time.
- [x] Bakers take wheat, craft to bread, and put bread in storage.
- [ ] Dorfs get hungry, take bread from storage, and consume it.
- [ ] Stuff shouldn't spawn on top of each other
- [x] Remove \*Item classes, instead have a base item class that's defined in the resource
- [ ] FOV
  - [ ] Don't know if your resource is gone until it's in FOV
  - [ ] If resource is missing- still walk to goal spot, then begin "wander" looking for the next resource. Show a - [?] while looking- villager will automatically start collecting the next found resource unless player intervenes and tells villager to go elsewhere.
  - [ ] Only avoid obstacles in FOV
    - [ ] If direct path is blocked, iterate outwards until a clear path in FOV is found. Maintain that dir until a FOV towards coord is clear, then follow that vector
- [x] Remove self from objs when resource runs out
- [ ] Trees should "spread" - grow more trees nearby - still have random spawn, but more likely to grow near each other
- [x] Show floating text (placeholder UI) for currently selected stats- should live update
  - [ ] Should be able to click outside of an object to "unselect"
- [ ] v2? Layered sprites for colors
      https://www.emanueleferonato.com/2021/01/28/mix-and-merge-more-sprites-into-one-single-game-object-in-your-html5-games-thanks-to-phaser-rendertexture-game-object/
- [x] Wander speed and destination speed should be different
  - [x] Maybe wander speed is randomized every change in direction?
- [x] Stats should use standard deviation
  - [ ] v2? Breeding should retain stats of parents- standard deviation with a bias as the average of the parents.
- [ ] Have stats for each collection type (mine, tree, farm) that raises as you do the task (and lowers the longer you're away from the task)
  - [ ] Stats effect collection speed
  - [ ] Can also have stats such as strength which allows carrying more weight
  - [ ] Also have invisible stats for how quickly dorf gains stats (gains mining skill quicker than farming, for example)
  - [ ] Dorfs can have sterility (or successful breeding stat/chance?)
    - [ ] Inbreeding increases sterility and stats are biased slightly lower
    * Flatter deviation (in addition to reduced bias), so more likely to hit extremes
- [x] Collecting animations
  - [x] Speed of collecting animation based on collect_speed
- [x] Items should have weights
  - [x] Max inventory is based on weight, not count
- [ ] Villagers should have hunger / sleep
- [ ] Storage should have max inventory
- [x] Z index based on Y
- [x] Names
- [x] Click to select villager
  - [x] Show profession, name, speed, collection, house, destination, job site, gender
- [x] GUI - show resources, selected villager, etc
- [x] Resource: Wheat
- [ ] Profession: Builder
  - [ ] House
  - [ ] Bakery
  - [ ] Smith
- [ ] House
  - [ ] Limited tenants
  - [ ] Allows rest
  - [ ] Allows food (if available)
- [ ] Bakery
  - [ ] Allows crafting wheat -> bread
- [ ] Smith
  - [ ] Allows crafting stone -> brick
- [ ] Aging
- [ ] Death
  - [ ] Starvation
  - [ ] Old Age
- [ ] Birth
  - [ ] From a couple living together
- [ ] How should resources be created?
  - [ ] Trees could be planted (or random?)
  - [ ] Fields can be planted and regrow constantly
  - [ ] ????? Mines ????? - Randomly get placed

---

## Colors:

> `#140C1C` night
> `#442434` plum
> `#30346D` neptune
> `#4E4A4E` stone
> `#854C30` dirt
> `#346524` pickle
> `#D04648` red
> `#757161` ashen
> `#597DCE` puddle
> `#D27D2C` pumpkin
> `#8595A1` concrete
> `#6DAA2C` grass
> `#D2AA99` peach
> `#6DC2CA` sky
> `#DAD45E` sun
> `#DEEED6` clouds

---
