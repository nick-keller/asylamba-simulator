
function runSimulations(args) {

  // argument capture
  var iterations = args.iterations;

  var testFleet = [
    [[7,4,3,0,2,0,0,0,0,0,0,0],[4,4,0,4,3,0,4,0,0,0,0,0],[2,2,0,3,0,0,2,3,0,2,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]]
  ];
  var fleets = [
            args.attackingFleet || testFleet.slice()),
            args.defendingFleet || testFleet.slice())
  ];


  // Throwing cases
  if (isNaN(iterations) || iterations <= 0) {
    alert('Le nombre d\'itérations doir être un nombre strictement positif');
    return 0;
  }

  if (iterations > 10000) {
    alert('Tu veux vraiment faire crasher ton navigateur?');
    return 0;
  }

  if (!window.Worker) {
    alert('Ton navigateur ne supporte pas les web worker.\nPas de simulation pour toi!');
    return 0;
  }

  
  // Splitting every individual ship
  for (var i1 = 0; i1 < 2; i1++) {
    for (var i2 = 0; i2 < 5; i2++) {
       for (var i3 = 0; i3 < 5; i3++) {

        // Squad transcription
        var squad = fleets[i1][i2][i3]; // Saved ship quantity
        fleets[i1][i2][i3] = [];
        for (var i = 0; i < 12; i++) {
          for (var j = squad[i]; j >= 0; j--) {
            fleets[i1][i2][i3].push(createNewShip(i));
          }
        }

      }
    }
  }

  var worker = new Worker('task.js');
  worker.postMessage();

  // Pass the used fleets
  worker.postMessage({
    type: 'fleets',
    data: fleets
  });

  // Preparing recursive call
  myWorker.onmessage = function(e) {

    if (e.type === 'finishedSimulation') {
      // ToDo::Nico Update UI with 'iterations' and 'e.data'

      // If we haven't reached the final loop, start another simulation
      if (iterations--) {
        worker.postMessage({
          type: 'simulation'
        });
        return;
      }

      // Else, finish the simulation loop
      worker.terminate();
      // Do stuff
      
      return;
    }

    console.log('Unknown message received from worker.');
    console.log('\ntype:');
    console.log(e.type);
    console.log('\ndata:');
    console.log(e.data);

  }

  return 0;
}

function createNewShip (shipID) {
  // 0: Pégase done
  // 1: Satyre
  // 2: Chimère
  // 3: Sirène
  // 4: Dryade
  // 5: Méduse
  // 6: Griffon
  // 7: Cyclope
  // 8: Minotaure
  // 9: Hydre
  // 10: Cerbère
  // 11: Phénix
  throw 'FUNCTON NOT FINISHED YET';

  // ToDo::Ben Use ships.js

  if (shipID === 0) {
    return {
      nom: 'Pégase',
      defense: 1,
      vitesse: 195,
      coque: 26,
      pev: 2,
      attaques: [5]
    };
  }

  if (shipID === 2) {
    return {
      nom: 'Chimère',
      defense: 3,
      vitesse: 195,
      coque: 26,
      pev: 3,
      attaques: [6, 6]
    };
  }


}
