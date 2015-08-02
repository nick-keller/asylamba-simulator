'use strict';
// WRITE OPTIMIZED CODE IN HERE

var attackingFleet = undefined;
var defendingFleet = undefined;

var linesEngaged = -1;
var roundUntilNextLine = -1;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulation () {

  if (!attackingFleet || !defendingFleet) {
    postMessage({
      type: 'log',
      value: 'No fleet provided'
    });
    return;
  };

  linesEngaged = 1;
  roundUntilNextLine = 3;
  while (!attackingFleet.isEmpty() && !defendingFleet.isEmpty()) {

    for (var i = linesEngaged; i >= 0; i--) {
      // ToDo::Ben -- Make them fight
      // ToDp::Ben -- Refactor the isEmpty system to a turn baser check
    };

    if (linesEngaged === 5) {
      continue;
    }

    if (--roundUntilNextLine === 0) {
      roundUntilNextLine = 3;
      linesEngaged++;
    }
  }

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
  this.pev = model.pev;
  this.attaques = model.attaques.splice();

  this.attack = function(squad) {
    if (squad.isEmpty() === true) {
      return
    }
    // ToDo::Ben -- Fire on squad.ships[getRandomInt(0, squad.ships.size)]
  };
}

function Squad (array, team) {

  this.ships = [];
  this.target = undefined;

  this.team = team;

  this.isEmpty = function() {
    return (this.ships.length === 0);
  }

  for (var i = 0; i < 12; i++) {
    for (var j = squad[i]; j >= 0; j--) {
      // Pushing the correct number of this ship in the squad
      this.ships.push(new Ship(ships[i]));
    }
  }

  this.attack = function(targettedSquad) {

    if (!targettedSquad) {
      if (this.target === undefined) {
        if (this.team === 0) {
          this.target = attackingFleet.getRandomSquad();
        }

        if (this.team === 1) {
          this.target = defendingFleet.getRandomSquad();
        }
      }
      return this.attack(this.target);
    }

    if (targettedSquad.isEmpty()) {
      return this.attack();
    }

    // Order every ship to attack the target fleet
    for (var i = this.ships.length - 1; i >= 0; i--) {
      this.ships[i].attack(squad);
    };



  };

}

function Fleet () {
  this.squads = [[], [], [], [], []];

  this.isEmpty = function () {
    // ToDo::Ben -- Find an optimized way to check if the fleet is empty
  };

  this.getRandomSquad = function() {
    // ToDo::Ben -- Get a random, non-empty squad in an optimized way, almong the engaged lines
  }

  this.addSquad = function (squad, line) {
    this.squad[line].push(squad);
  };

}

function setFleets (args) {
  // Splitting every individual ship
    defendingFleet = new Fleet();
    for (var line = 0; line < 5; line++) {
      for (var rank = 0; rank < 5; rank++) {

        var squad = new Squad(args.defending[line][rank], 0);

        if (squad.isEmpty() === true) {
          defendingFleet.addSquad(squad, line)
        }

      }
    }

    attackingFleet = new Fleet();
    for (var line = 0; line < 5; line++) {
      for (var rank = 0; rank < 5; rank++) {

        var squad = new Squad(args.defending[line][rank], 1);

        if (squad.isEmpty() === true) {
          attackingFleet.addSquad(squad, line)
        }

      }
    }


  }
}

onmessage = function(e) {

  if (e.data.type === 'fleets') {
    setFleets(e.data.value);
    return;
  }

  if (e.data.type === 'simulation') {
    simulation();
    return;
  }

  console.log('Unknown message received from browser.');
  console.log('\ntype:');
  console.log(e.data.type);
  console.log('\ndata:');
  console.log(e.data.value);

}
