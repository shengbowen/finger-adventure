/* eslint-disable global-require */
import Leaves from './Leaves';
import queue from './preload';
import Floor from './Floor';
import './assets/reset.css';

window.onload = () => {
  const canvas = document.querySelector('#stage');
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;

  const stage = new createjs.Stage(canvas);

  // const queue = new createjs.LoadQueue();

  function handleComplete() {
    const leves = new Leaves({}, canvas);
    const leafCon = leves.init();
    const floor = new Floor({}, canvas);
    floor.init();
    stage.addChild(leafCon, floor.instance);
    stage.update();
    createjs.Ticker.addEventListener('tick', () => {
      leves.tranlateY(50);
      stage.update();
    });
  }

  queue.on('complete', handleComplete);
};
