/* eslint-disable global-require */
import Leaves from './Leaves';
import queue from './preload';
import './assets/reset.css';

window.onload = () => {
  const canvas = document.querySelector('#stage');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stage = new createjs.Stage(canvas);

  // const queue = new createjs.LoadQueue();

  function handleComplete() {
    const leves = new Leaves({}, canvas);
    const leafCon = leves.init();
    stage.addChild(leafCon);
    stage.update();
  }

  queue.on('complete', handleComplete);
};
