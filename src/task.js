'use strict';

var flottes = [];

// WRITE OPTIMIZED CODE IN HERE
function simulation () {
  // ToDo::Ben Faire la logique de la simulation

  // Simulation terminée
  postMessage({
    type: 'finishedSimulation',
    data: ''
  });
}

onmessage = function(e) {
  
  if (e.type === 'flottes') {
    flottes = e.data;
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