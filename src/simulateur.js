
function runSimulations(args, $scope) {

  // argument capture
  var iterations = args.iterations;
  var counter = iterations;

  /* var testFleet = [
    [[1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
    [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]]
  ]; */
  var fightResults = [0, 0]; //number of times team(1||0) won a fight.
  var averageFleet = [[0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0]]; // used to display the average remaining ships after the fight.

  var fleets = {
    attacking: args.attackingFleet /*|| testFleet.slice()*/,
    defending: args.defendingFleet /*|| testFleet.slice()*/
  };

  //fleets.defending[0][0][6] = 1;


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

  // Pass the ships object
  worker.postMessage({
    type: 'ships.js',
    value: ships
  });

  var updateProgress = _.debounce(function(progress) {
    $scope.progress = progress;
    $scope.$apply();
  }, 500, {maxWait: 500});

  // Preparing recursive call
  worker.onmessage = function(e) {

    if (e.data.type === 'finishedSimulation') {
      updateProgress(100 - counter/iterations *100);

      // If we haven't reached the final loop, start another simulation
      if (counter-- !== 0) {

        //update fight statistics
        for (var i = e.data.value.length - 1; i >= 0; i--) {
          for (var j = e.data.value[i].length - 1; j >= 0; j--) {
            for (var k = e.data.value[i][j].length - 1; k >= 0; k--) {  //for each row of winning fleet, for each columns, foreach ship
                averageFleet[e.data.value.team][k] = averageFleet[e.data.value.team][k] + e.data.value[i][j][k];
            }
          }
        }
        fightResults[e.data.value.team]++;

        // Pass the used fleets
        // ToDo::Ben -- Switch the fleets creation to the browser
        worker.postMessage({
          type: 'fleets',
          value: fleets
        });

        worker.postMessage({
          type: 'simulation'
        });
        return;
      }

      // Else, finish the simulation loop
      worker.terminate();
      $scope.flotte0 = fightResults[0];
      $scope.flotte1 = fightResults[1];
      $scope.averageFleet = averageFleet;

      return;
    }

    console.warn('Unknown message received from worker.');
    console.warn('\ntype:');
    console.warn(e.data.type);
    console.warn('\ndata:');
    console.warn(e.data.value);

  };

  // Pass the used fleets
  worker.postMessage({
    type: 'fleets',
    value: fleets
  });

  // Here we goooooooo
  worker.postMessage({
    type: 'simulation'
  });

  return 0;
}
