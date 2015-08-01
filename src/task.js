'use strict';

var fleets = [];

// WRITE OPTIMIZED CODE IN HERE
function simulation () {
  // ToDo::Ben Do the simulation logic

  // Simulation finished
  postMessage({
    type: 'finishedSimulation',
    data: ''
  });
}

onmessage = function(e) {
  
  if (e.type === 'fleets') {
    fleets = e.data;
    return;
  }

  if (e.type === 'simulation') {
    simulation();
    return;
  }

  console.log('Unknown message received from browser.');
  console.log('\ntype:');
  console.log(e.type);
  console.log('\ndata:');
  console.log(e.data);

}