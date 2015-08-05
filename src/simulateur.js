
function runSimulations(args, $scope) {

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
            args.attackingFleet || testFleet.slice(),
            args.defendingFleet || testFleet.slice()
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
            // Pushing the correct number of this ship in the squad
            fleets[i1][i2][i3].push(_.cloneDeep(ships[i]));
          }
        }

      }
    }
  }

  var worker = new Worker('src/task.js');

  // Pass the used fleets
  worker.postMessage({
    type: 'fleets',
    data: fleets
  });

  var updateProgress = _.debounce(function(progress) {
    $scope.progress = progress;
    $scope.$apply();
  }, 500, {maxWait: 500});

  // Preparing recursive call
  worker.onmessage = function(e) {
    if (e.data.type === 'log') {
      console.log('Worker log:\n' + e.data.value);
      return;
    }

    if (e.data.type === 'finishedSimulation') {
      updateProgress(100 - iterations/$scope.numberIterations *100);

      // If we haven't reached the final loop, start another simulation
      if (iterations--) {
        //setTimeout(function() {
          worker.postMessage({
            type: 'simulation'
          });
        //}, 10);
        return;
      }

      // Else, finish the simulation loop
      worker.terminate();
      // Do stuff

      return;
    }

    console.log('Unknown message received from worker.');
    console.log('\ntype:');
    console.log(e.data.type);
    console.log('\ndata:');
    console.log(e.data.value);

  };

  worker.postMessage({
    type: 'simulation'
  });

  return 0;
}
