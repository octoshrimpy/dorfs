# MVP

Art Needs:
  [x] Tents/Houses/Sleepies
  [ ] Each piece of Dorf separate and white-scaled. So pure white, but make the shadows grey.
  [ ] Beard/hair, skin, pants, shirt each as separate full white sprites.
  [ ] Different sprite sheets for trees / 2x3 sprites
  [ ] Maybe have a sprite variation of carrying a sack/backpack when inventory is full?

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

===

# V2

* slimes for hire
    * _slime shop when too much to do, costs money instead of food/sleep_
    * money acquired by selling to random wandering traders
    * forge money with gold

Colors:
#140C1C
#442434
#30346D
#4E4A4E
#854C30
#346524
#D04648
#757161
#597DCE
#D27D2C
#8595A1
#6DAA2C
#D2AA99
#6DC2CA
#DAD45E
#DEEED6

===

Bugs:


<!-- setTint(0xff0000) -->
Rocco Notes
  [√] Remove *Item classes, instead have a base item class that's defined in the resource
  [ ] FOV
      [ ] Don't know if your resource is gone until it's in FOV
      [ ] If resource is missing- still walk to goal spot, then begin "wander" looking for the next resource. Show a [?] while looking- villager will automatically start collecting the next found resource unless player intervenes and tells villager to go elsewhere.
      [ ] Only avoid obstacles in FOV
          [ ] If direct path is blocked, iterate outwards until a clear path in FOV is found. Maintain that dir until a FOV towards coord is clear, then follow that vector
  [√] Remove self from objs when resource runs out
  [ ] Trees should "spread" - grow more trees nearby - still have random spawn, but more likely to grow near each other
  [ ] Trees/Rocks should regrow naturally VERY slowly- however, mine/forest patches can be placed which gives increased growth in that area
  [ ] Show floating text (placeholder UI) for currently selected stats- should live update
  [ ] Should be able to click outside of an object to "unselect"
  [ ] Layered sprites for colors
      https://www.emanueleferonato.com/2021/01/28/mix-and-merge-more-sprites-into-one-single-game-object-in-your-html5-games-thanks-to-phaser-rendertexture-game-object/
  [ ] Wander speed and destination speed should be different
      [ ] Maybe wander speed is randomized every change in direction?
  [√] Stats should use standard deviation
      [ ] Breeding should retain stats of parents- standard deviation with a bias as the average of the parents.
  [ ] Have stats for each collection type (mine, tree, farm) that raises as you do the task (and lowers the longer you're away from the task)
      [ ] Stats effect collection speed
      [ ] Can also have stats such as strength which allows carrying more weight
      [ ] Also have invisible stats for how quickly dorf gains stats (gains mining skill quicker than farming, for example)
      [ ] Dorfs can have sterility (or successful breeding stat/chance?)
      [ ] Inbreeding increases sterility and stats are biased slightly lower
          * Flatter deviation (in addition to reduced bias), so more likely to hit extremes
  [√] Collecting animations
      [√] Speed of collecting animation based on collect_speed
  [√] Items should have weights
      [√] Max inventory is based on weight, not count
  [ ] Villagers should have hunger / sleep
  [ ] Storage should have max inventory
  [√] Z index based on Y
  [√] Names
  [ ] Click to select villager
      [√] Show profession, name, speed, collection, house, destination, job site, gender
  [ ] GUI - show resources, selected villager, etc
  [ ] Resource: Wheat
  [ ] Profession: Builder
      [ ] House
      [ ] Bakery
      [ ] Smith
  [ ] House
      [ ] Limited tenants
      [ ] Allows rest
      [ ] Allows food (if available)
  [ ] Bakery
      [ ] Allows crafting wheat -> bread
  [ ] Smith
      [ ] Allows crafting stone -> brick
  [ ] Aging
  [ ] Death
      [ ] Starvation
      [ ] Old Age
  [ ] Birth
      [ ] From a couple living together
  [ ] How should resources be created?
      [ ] Trees could be planted (or random?)
      [ ] Fields can be planted and regrow constantly
      [ ] ????? Mines ????? - Randomly get placed
