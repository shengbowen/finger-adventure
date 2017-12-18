/* eslint-disable global-require */

const queue = new createjs.LoadQueue();

queue.loadManifest([
  { id: 'left', src: require('./assets/left.png') },
  { id: 'right', src: require('./assets/right.png') },
]);

export default queue;
