# MVP

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



===

Rocco Notes
  [√] Stats should use standard deviation
      [ ] Breeding should retain stats of parents- standard deviation with a bias as the average of the parents.
  [ ] Have stats for each collection type (mine, tree, farm) that raises as you do the task (and lowers the longer you're away from the task)
      [ ] Stats effect collection speed
      [ ] Can also have stats such as strength which allows carrying more weight
      [ ] Also have invisible stats for how quickly dorf gains stats (gains mining skill quicker than farming, for example)
      [ ] Dorfs can have sterility (or successful breeding stat/chance?)
      [ ] Inbreeding increases sterility and stats are biased slightly lower
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
      [ ] house
      [ ] bakery
      [ ] smith
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
