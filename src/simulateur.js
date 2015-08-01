
function runSimulations(args) {

  // argument capture
  var iterations = args.iterations;

  var floteTest = [
    [[7,4,3,0,2,0,0,0,0,0,0,0],[4,4,0,4,3,0,4,0,0,0,0,0],[2,2,0,3,0,0,2,3,0,2,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]]
  ];
  var flottes = [
            args.flotteAttaquant || JSON.decode(JSON.encode(floteTest)),
            args.flotteDefendant || JSON.decode(JSON.encode(floteTest))
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

  
  // Creation de chaque vaisseau individuel dans la flotte
  for (var i1 = 0; i1 < 2; i1++) {
    for (var i2 = 0; i2 < 5; i2++) {
       for (var i3 = 0; i3 < 5; i3++) {

        // Transcription de l'escadrille
        var escadrille = flottes[i1][i2][i3]; // quantité de vaisseaux sauvegardée
        flottes[i1][i2][i3] = [];
        for (var i = 0; i < 12; i++) {
          for (var j = escadrille[i]; j >= 0; j--) {
            flottes[i1][i2][i3].push(createNewShip(i));
          }
        }

      }
    }
  }

  var worker = new Worker('task.js');
  worker.postMessage();

  // On passe les flottes utilisées pour qu'il les enregistre une fois pour toutes
  worker.postMessage({
    type: 'flottes',
    data: flottes
  });

  // On prepare l'appel recusif
  myWorker.onmessage = function(e) {

    if (e.type === 'finishedSimulation') {
      // ToDo::Nico Mettre a jour l'UI d'avancement en fonction de iterations (le nombre d'iterations restantes) et e.data (le resultat de cette simulation)

      // Si on a pas atteint l'iteration zero, on relance une simulation
      if (iterations--) {
        worker.postMessage({
          type: 'simulation'
        });
        return;
      }

      // Si oui, on signale que la simulation est terminée
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

  // ToDo::Ben Utiliser le fichier ships.js

  if (shipID === 0) {
    return {
      nom: 'Pégase',
      defense: 1,
      vitesse: 195,
      coque: 26,
      pev: 2, // Useless?
      attaques: [5]
    };
  }

  if (shipID === 2) {
    return {
      nom: 'Pégase',
      defense: 3,
      vitesse: 195,
      coque: 26,
      pev: 3, // Useless?
      attaques: [6, 6]
    };
  }


}
