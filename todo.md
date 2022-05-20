# MVP

## Art Needs:
- [x] Tents/Houses/Sleepies
- [ ] Each piece of Dorf separate and white-scaled. So pure white, but make the shadows grey.
- [ ] Beard/hair, skin, pants, shirt each as separate full white sprites.
- [ ] Different sprite sheets for trees / 2x3 sprites
- [ ] Maybe have a sprite variation of carrying a sack/backpack when inventory is full?
- [ ] GUI
    - [ ] Overall (Resources, villager count, babies, villagers per profession...)
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
* add 3 kinds of land
    * infinite resource pool
        * will auto-add to inventory (later might drop on ground for sweeping)
    * storage location
    * recharge station (bed/sleeping/house)
* movement across playable map
    * has to update as new land is added
* task list
    * dorfs can
* sprites
    * buildings
        * House
        * Bakery
        * Smith
  * Resources:
    * Full size Trees
    * Full size Boulders
    * Full size Field/Grasses

---

## V2

* slimes for hire
    * _slime shop when too much to do, costs money instead of food/sleep_
    * money acquired by selling to random wandering traders
    * forge money with gold

## Colors:


>`#140C1C`<span class="color night"></span>night 
>`#442434`<span class="color plum"></span>plum
>`#30346D`<span class="color neptune"></span>neptune
>`#4E4A4E`<span class="color stone"></span>stone
>`#854C30`<span class="color dirt"></span>dirt
>`#346524`<span class="color pickle"></span>pickle
>`#D04648`<span class="color red"></span>red
>`#757161`<span class="color ashen"></span>ashen
>`#597DCE`<span class="color puddle"></span>puddle
>`#D27D2C`<span class="color pumpkin"></span>pumpkin
>`#8595A1`<span class="color concrete"></span>concrete
>`#6DAA2C`<span class="color grass"></span>grass
>`#D2AA99`<span class="color peach"></span>peach
>`#6DC2CA`<span class="color sky"></span>sky
>`#DAD45E`<span class="color sun"></span>sun
>`#DEEED6`<span class="color clouds"></span>clouds

---

## Known Bugs
- 


---

## Rocco Notes

- [x] Wheat should grow in patches. Grows over time, can only be harvested once full, the falls back to initial state where it must grow over time.
- [ ] Bakers take wheat, craft to bread, and put bread in storage.
- [ ] Dorfs get hungry, take bread from storage, and consume it.
- [ ] Stuff shouldn't spawn on top of each other
- [x] Remove *Item classes, instead have a base item class that's defined in the resource
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
- [ ] Wander speed and destination speed should be different
    - [ ] Maybe wander speed is randomized every change in direction?
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

[ignore this stuff]:#

<style>
  .color{ 
    width: 1em; height: 1em;
    display: inline-flex;
    position: relative; top: 0.125em; 
    margin: 0 0.25rem;
  }
  .night {background: #140C1C;}
  .plum {background: #442434;} 
  .neptune {background: #30346D;} 
  .stone {background: #4E4A4E;} 
  .dirt {background: #854C30;} 
  .pickle {background: #346524;} 
  .red {background: #D04648;} 
  .ashen {background: #757161;} 
  .puddle {background: #597DCE;} 
  .pumpkin {background: #D27D2C;} 
  .concrete {background: #8595A1;} 
  .grass {background: #6DAA2C;} 
  .peach {background: #D2AA99;} 
  .sky {background: #6DC2CA;} 
  .sun {background: #DAD45E;} 
  .clouds {background: #DEEED6;} 
</style>