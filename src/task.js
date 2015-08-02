'use strict';

var fleets = [];

// WRITE OPTIMIZED CODE IN HERE
function simulation () {

  // ToDo::Ben Do the simulation logic

  // Simulation finished
  postMessage({
    type: 'finishedSimulation',
    value: ''
  });
}

onmessage = function(e) {

  if (e.data.type === 'fleets') {
    fleets = e.data.value;
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
