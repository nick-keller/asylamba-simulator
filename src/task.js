'use strict';
// WRITE OPTIMIZED CODE IN HERE

var ships;

var attackingFleet;
var defendingFleet;

var linesEngaged = -1;
var roundUntilNextLine = -1;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulation () {

  if (!attackingFleet || !defendingFleet) {
    console.log('No fleet provided');
    return;
  }

  console.log(defendingFleet);

  linesEngaged = 1;
  roundUntilNextLine = 3;

  while (!attackingFleet.isEmpty() && !defendingFleet.isEmpty()) {

    // console.log('New round');
    defendingFleet.cleanupEmptySquads();
    attackingFleet.cleanupEmptySquads();

    for (var i = 0; i < linesEngaged; i++) {
      for (var j = defendingFleet.squads[i].length - 1; j >= 0; j--) {
        defendingFleet.squads[i][j].attack();
      }
    }

    for (var i = 0; i < linesEngaged; i++) {
      for (var j = attackingFleet.squads[i].length - 1; j >= 0; j--) {
        attackingFleet.squads[i][j].attack();
      }
    }

    if (linesEngaged !== 5) {
      if (--roundUntilNextLine === 0) {
        roundUntilNextLine = 3;
        linesEngaged++;
      }
    }

  }

  console.log(attackingFleet);
  console.log(defendsingFleet);

  // Simulation finished
  postMessage({
    type: 'finishedSimulation',
    value: ''
  });
}

function Ship (model) {
  this.name = model.name;
  this.defense = model.defense;
  this.vitesse = model.vitesse ;
  this.coque = model.coque;
  // this.pev = model.pev;
  this.attaques = model.attaques;
}

function Squad (array, team) {

  this.ships = [];
  this.target = undefined;

  this.team = team;


  // Initialization
  for (var i = 0; i < 12; i++)
    for (var j = array[i]; j >= 0; --j) {
      if (array[i] === 0)
        continue;
      this.ships.push(new Ship(ships[i]));
    }
  this.isEmpty = function() {
    return (this.ships.length === 0);
  };

  this.attack = function(targettedSquad) {
    // ToDo::Ben -- Put the counterstrike in place
    if (attackingFleet.isEmpty() || defendingFleet.isEmpty()) {
      return 0;
    }

    if (!targettedSquad) {
      if (this.target === undefined) {

        if (this.team === 0)
          this.target = attackingFleet.getRandomSquad();

        if (this.team === 1)
          this.target = defendingFleet.getRandomSquad();

      }
      return this.attack(this.target);
    }

    if (targettedSquad.isEmpty())
      return this.attack();

    // Order every ship to attack the target fleet
    for (var i = this.ships.length - 1; i >= 0; i--) {

      targettedSquad.target = this;

      if (targettedSquad.isEmpty())
        return 1;

      var attackingShip = this.ships[i];

      for (var j = attackingShip.attaques.length - 1; j >= 0; j--) {

        if (targettedSquad.isEmpty())
          return 1;

        var attackPower = attackingShip.attaques[j];

        var targettedShipIndex = getRandomInt(0, targettedSquad.ships.length - 1);
        var targettedShip = targettedSquad.ships[targettedShipIndex];

        console.log(targettedSquad.ships);

        console.log(attackingShip.name + ' fires on ' + targettedShip.name);

        if ((80/targettedShip.vitesse) > Math.random())
          targettedShip.coque -= Math.log((attackPower/targettedShip.defense) + 1)*4*attackPower;


        // Destroy the ship
        if (targettedShip.coque <= 0)
          targettedSquad.ships.splice(targettedShipIndex, 1);

      }

    }

  };

}

function Fleet () {
  this.squads = [[], [], [], [], []];

  this.isEmpty = function () {

    for (var i = 4; i >= 0; i--)
      for (var j = this.squads[i].length - 1; j >= 0; j--)
        if (this.squads[i][j].isEmpty() === false)
          return false;

    return true;
  };

  this.cleanupEmptySquads = function () {
    for (var i = 4; i >= 0; i--)
      for (var j = this.squads[i].length - 1; j >= 0; j--)
        if (this.squads[i][j].isEmpty() === true)
          this.squads[i].splice(j, 1);
  };

  this.getRandomSquad = function() {

    var tab = [];

    this.squads.forEach(function(line) {
      tab = tab.concat(line);
    });

    return tab[Math.floor(Math.random() * tab.length)];

  };

  this.addSquad = function (squad, line) {
    this.squads[line].push(squad);
  };

}

function setFleets (args) {
  // Splitting every individual ship
  var line;
  var rank;

  console.log('Fleets set');

  defendingFleet = new Fleet();
  for (line = 0; line < 5; line++) {
    for (rank = 0; rank < 5; rank++) {


      var squad = new Squad(args.defending[line][rank], 0);


      if (squad.isEmpty() === false) {
        defendingFleet.addSquad(squad, line);
      }

    }
  }

  attackingFleet = new Fleet();
  for (line = 0; line < 5; line++) {
    for (rank = 0; rank < 5; rank++) {

      var squad = new Squad(args.defending[line][rank], 1);

      if (squad.isEmpty() === false) {
        attackingFleet.addSquad(squad, line);
      }

    }
  }


}

onmessage = function(e) {

  if (e.data.type === 'simulation') {
    simulation();
    return;
  }

  if (e.data.type === 'fleets') {
    setFleets(e.data.value);
    return;
  }

  if (e.data.type === 'ships.js') {
    ships = e.data.value;
    return;
  }

  console.log('Unknown message received from browser.');
  console.log('\ntype:');
  console.log(e.data.type);
  console.log('\ndata:');
  console.log(e.data.value);

};
