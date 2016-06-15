// var mob = new Mob(gameState, 1, 41, 32);
//     mob.exposeMap(map);
//     allMobs[1] = mob;
//     mob_data = mob.getData();
//     map.mobEnterChunk(mob, Math.floor(mob_data.x/gameState.chunkSize.x), Math.floor(mob_data.y/gameState.chunkSize.y));

// ideally create spawns after map has loaded its resources
// one time spawners?
// this is not a container for a mob
var logger = require('tracer').colorConsole();
var enums = require('./enums.js');
var Mob = require('./mob.js');
function Spawner(id, mob_class, x, y, respawn_time){
	this.x = x;
	this.y = y;

	this.id = id;
	this.spawnDaily = false;
	this.spawnOnce = false;
	this.respawnTime = respawn_time || 10 * 1000;
	this.timeOfDeath = new Date().getTime();
	this.mobConstructor = mob_class;
	this.mob = null;
}



module.exports = function SpawnerManager(gameState, allMobs){
	this.allSpawners = []; // don't need no disgusting id's. just a list.
	var currentSpawnerId = 0;
	this.createSpawner = function(mob_class, spawn_x, spawn_y, respawn_time) {
		this.allSpawners.push(new Spawner(this.giveId(), mob_class, spawn_x, spawn_y, respawn_time));
	};
	this.giveId = function() {
		return currentSpawnerId++;
	};
	this.populateSpawners = function() {
		var spawners = MAP.getSpawners();
		for(var i = 0; i < spawners.length; i++){
			this.createSpawner(constructors[spawners[i].name], spawners[i].x, spawners[i].y, spawners[i].respawnTime);
			
		}
		// old spawns in case something goes wrong
		
		// this.createSpawner(Bat, 60, 26, 2000);
		// this.createSpawner(Bat, 27, 17, 2000);
		// this.createSpawner(Dummy, 48, 45, 4000);
		// this.createSpawner(Bat, 29, 17, 2000);
		// this.createSpawner(Bat, 30, 17, 2000);
		// this.createSpawner(Bat, 31, 17, 2000);
		// this.createSpawner(Bat, 36, 24, 2000);
		// this.createSpawner(Bat, 37, 22, 2000);
		// this.createSpawner(Bat, 38, 22, 2000);
		// this.createSpawner(Bat, 39, 22, 2000);
		// this.createSpawner(Bat, 67, 27, 2000);
	};
	this.update = function() {
		for(var i = 0; i < this.allSpawners.length; i++){
			var s = this.allSpawners[i];
			if(!s.mob && gameState.frameTime - s.timeOfDeath > s.respawnTime){
				allMobs[s.id] = new s.mobConstructor(gameState, s.id, s.x, s.y);
				s.mob = allMobs[s.id];
				MAP.mobEnterChunk(allMobs[s.id], allMobs[s.id].currentChunk.x, allMobs[s.id].currentChunk.y);
				// s.mob = new s.mobClass(gameState, id, s.x, s.y);
				// s.mob.exposeMap(map);
				// allMobs[id] = s.mob;
			}
			else if(s.mob && s.mob.isDead()){
				s.mob = null;
				s.timeOfDeath = gameState.frameTime;
			}
		}
	};
}
// function Mob(gameState, id, spawn_x, spawn_y, name, exp, healthMax)

// this is cause mob types come as strings from the editor :(
var constructors = {
	'Bat': Bat,
	'Dummy': Dummy,
	'Ghoul': Ghoul,
	'Scorpion': Scorpion,
	'BigBat': BigBat
}




function Bat(gameState, id, spawn_x, spawn_y) {
	var hp = 12;
	var speed = 650;
	var exp = 3000;
	var mobWeapon = {type: enums.weaponType.MELEE, range: 1.5, damageMin: 1, damageMax: 4};
	var possibleLoot = {
        0: {item: IFAC.createItem(2), dropChance: 1}, //healthPot
        1: {item: IFAC.createItem(5), dropChance: 0.9},
        2: {item: IFAC.createItem(3), dropChance: 0.9},
        3: {item: IFAC.createArmor(5), dropChance: 1},
        4: {item: IFAC.createSkill(4), dropChance: 1},
        5: {item: IFAC.createItem(6), dropChance: 1}
    };
    Mob.call(this, gameState, id, spawn_x, spawn_y, 'Bat', exp, hp, speed, possibleLoot, mobWeapon);
}
Bat.prototype = Object.create(Mob.prototype);
Bat.prototype.constructor = Bat;


function BigBat(gameState, id, spawn_x, spawn_y) {
	var hp = 380;
	var speed = 800;
	var exp = 85000000;
	var mobWeapon = {type: enums.weaponType.MELEE, range: 1.5, damageMin: 7, damageMax: 35};
    var possibleLoot = {
        0: {item: IFAC.createSkill(5), dropChance: 0.5},
        1: {item: IFAC.createArmor(6), dropChance: 0.5},
        2: {item: IFAC.createSkill(8), dropChance: 1},
        3: {item: IFAC.createArmor(7), dropChance: 0.8},
        4: {item: IFAC.createArmor(8), dropChance: 0.8}
    };

    Mob.call(this, gameState, id, spawn_x, spawn_y, 'Big Bat', exp, hp, speed, possibleLoot, mobWeapon);
}
BigBat.prototype = Object.create(Mob.prototype);
BigBat.prototype.constructor = BigBat;

function Ghoul(gameState, id, spawn_x, spawn_y) {
	var hp = 100;
	var speed = 800;
	var exp = 85000000;
	var mobWeapon = {type: enums.weaponType.MELEE, range: 1.5, damageMin: 7, damageMax: 15};
    var possibleLoot = {
        0: {item: IFAC.createWeapon(9), dropChance: 1},
        1: {item: IFAC.createWeapon(5), dropChance: 0.1},
        2: {item: IFAC.createGold(), dropChance: 0.6, maxQuantity: 40},
        3: {item: IFAC.createItem(4), dropChance: 1} 
    };

    Mob.call(this, gameState, id, spawn_x, spawn_y, 'Ghoul', exp, hp, speed, possibleLoot, mobWeapon);
}
Ghoul.prototype = Object.create(Mob.prototype);
Ghoul.prototype.constructor = Ghoul;

function Scorpion(gameState, id, spawn_x, spawn_y) {
	var hp = 60;
	var speed = 700;
	var exp = 32;
    var possibleLoot = {
    	
    };

    Mob.call(this, gameState, id, spawn_x, spawn_y, 'Scorpion', exp, hp, speed, possibleLoot);
}
Scorpion.prototype = Object.create(Mob.prototype);
Scorpion.prototype.constructor = Scorpion;


function Dummy(gameState, id, spawn_x, spawn_y) {
	var healthMax = 99999;


    Mob.call(this, gameState, id, spawn_x, spawn_y, 'Dummy', 0, healthMax);
    
    this.update = function() {};
    this.die = function() {
        this.heal(healthMax);
    };
}
Dummy.prototype = Object.create(Mob.prototype);
Dummy.prototype.constructor = Dummy;