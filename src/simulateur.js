
function runSimulations(args) {

  // argument capture
  var iterations = args.iterations;
  var counter = iterations;

  var testFleet = [
    [[7,4,3,0,2,0,0,0,0,0,0,0],[4,4,0,4,3,0,4,0,0,0,0,0],[2,2,0,3,0,0,2,3,0,2,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]]
  ];
  var fleets = {
    attacking: args.attackingFleet || testFleet.slice(),
    defending: args.defendingFleet || testFleet.slice()
  };


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

  var worker = new Worker('src/task.js');

  // Pass the used fleets
  worker.postMessage({
    type: 'fleets',
    data: fleets
  });

  // Preparing recursive call
  worker.onmessage = function(e) {
    if (e.data.type === 'log') {
      console.log('Worker log:\n' + e.data.value);
      return;
    }

    if (e.data.type === 'finishedSimulation') {
      // ToDo::Nico -- Update UI with 'iterations', 'counter', and 'e.data'
      console.log(counter, e.data.value);

      // If we haven't reached the final loop, start another simulation
      if (counter-- !== 0) {
        worker.postMessage({
          type: 'simulation'
        });
        return;
      }

      // Else, finish the simulation loop
      worker.terminate();
      // ToDo::Nico -- Stuff to do when simulation ends goes here

      return;
    }

    console.log('Unknown message received from worker.');
    console.log('\ntype:');
    console.log(e.data.type);
    console.log('\ndata:');
    console.log(e.data.value);

  };

  // Here we goooooooo
  worker.postMessage({
    type: 'simulation'
  });

  return 0;
}
