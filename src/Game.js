import queue from './preload';
import Floor from './Floor';
import Robot from './Robot';
import Leaves from './Leaves';

class Game {
  constructor() {
    // this.init();
  }

  init() {
    this.canvas = document.querySelector('#stage');
    this.canvas.width = window.innerWidth * 2;
    this.canvas.height = window.innerHeight * 2;
    this.stage = new createjs.Stage(this.canvas);

    queue.on('complete', this.handleComplete.bind(this));
  }

  handleComplete() {
    this.leves = new Leaves({}, this.canvas);
    this.floor = new Floor({}, this.canvas);
    this.robot = new Robot({}, this.canvas);
    this.floor.addFloors([0, 1, 1, 0, 1, 1], [0, 1, 2, 0, 1, 3]);
    this.stage.addChild(this.leves.sprite, this.floor.sprite, this.robot.sprite);
    this.stage.update();
    window.robot = this.robot;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', () => {
      // floor.addOneFloor(Math.floor(Math.random() + 1), Math.floor(Math.random() * 4), true);
      this.leves.tranlateY(50);
      this.stage.update();
    });
  }
}

export default Game;

