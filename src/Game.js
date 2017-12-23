import queue from './preload';
import Floor from './Floor';
import Robot from './Robot';
import Leaves from './Leaves';
import { moveXOffset, moveYOffset } from './config';

class Game {
  constructor() {
    // this.init();
  }

  init() {
    this.canvas = document.querySelector('#stage');
    this.canvas.width = window.innerWidth * 2;
    this.canvas.height = window.innerHeight * 2;
    this.stage = new createjs.Stage(this.canvas);
    this.background = new createjs.Shape();
    this.background.graphics.beginFill('#001605').drawRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.addChild(this.background);

    queue.on('complete', this.handleComplete.bind(this));
    this.bindEvents();
  }

  handleComplete() {
    this.leves = new Leaves({}, this.canvas);
    this.floor = new Floor({}, this.canvas);
    this.robot = new Robot({}, this.canvas);
    this.floor.sprite.addChild(this.robot.sprite); // robot 与阶梯是一体，这样才能在跳跃时保持robot与stair的相对距离
    this.floor.addFloors([0, 1, 1, 0, 1, 1], [0, 1, 2, 0, 1, 3]);
    this.stage.addChild(this.leves.sprite, this.floor.sprite);
    this.stage.update();
    window.robot = this.robot;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', () => {
      // floor.addOneFloor(Math.floor(Math.random() + 1), Math.floor(Math.random() * 4), true);
      this.leves.tranlateY(50);
      this.stage.update();
    });
  }

  bindEvents() {
    this.background.addEventListener('click', this.handleClick.bind(this)); // 必须有元素才会触发，点击空白区域无效
    // this.stage.addEventListener('click', this.handleClick); // 必须有元素才会触发，点击空白区域无效
  }

  handleClick(event) {
    const posX = event.stageX;
    if (posX > (this.canvas.width / 2)) {
      this.robot.moveRight();
      this.centerFloor(-1 * moveXOffset, -1 * moveYOffset);
    } else {
      this.robot.moveLeft();
      this.centerFloor(moveXOffset, -1 * moveYOffset);
    }
  }

  centerFloor(x, y) {
    const nextX = this.floor.sprite.x + x;
    const nextY = this.floor.sprite.y + y;
    console.log(nextX, nextY);
    createjs.Tween.get(this.floor.sprite, { override: true })
                  .to({
                    x: nextX,
                    y: nextY,
                  }, 500);
  }
}

export default Game;

