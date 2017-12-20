/* eslint-disable global-require */

const queue = new createjs.LoadQueue();

queue.loadManifest([
  { id: 'left', src: require('./assets/left.png') },
  { id: 'right', src: require('./assets/right.png') },
  { id: 'stair', src: require('./assets/barrier.png') },
  { id: 'player', src: require('./assets/player.png') },
]);

export default queue;
