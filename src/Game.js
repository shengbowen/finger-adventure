import queue from './preload';
import Floor from './Floor';
import Robot from './Robot';
import Leaves from './Leaves';
import { moveXOffset, moveYOffset } from './config';
import util from './util';

createjs.setInterval = (fun, itr) => {
  const c = new createjs.Container();
  const a = createjs.Tween.get(c).wait(itr).call(fun);
  a.loop = true;
  return a;
};

createjs.clearInterval = (timer) => {
  createjs.Tween.removeTweens(timer.target);
};

class Game {
  constructor(options) {
    // this.init();
    this.config = {
      initStairs: 8,
    };
    Object.assign(this.config, options);
    this.stairIndex = -1; // 记录当前跳到第几层
    this.autoDropTimer = null;
    this.clickTimes = 0;
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

  getInitialSequence() {
    const stairSeq = [];
    const barrSeq = [];
    for (let i = 0; i < this.config.initStairs; i += 1) {
      stairSeq.push(util.getRandom(0, 2));
      barrSeq.push(util.getRandomNumBySepcial(this.config.barrProbabitiy));
    }
    return {
      stairSeq,
      barrSeq,
    };
  }

  handleComplete() {
    const seq = this.getInitialSequence();
    this.leves = new Leaves(this.config, this.canvas);
    this.floor = new Floor(this.config, this.canvas);
    this.robot = new Robot({
      initDirect: seq.stairSeq[0],
    }, this.canvas);
    this.stairs = new createjs.Container();
    this.stairs.addChild(this.floor.sprite, this.robot.sprite);
    // robot 与阶梯是一体，这样才能在跳跃时保持robot与stair的相对距离
    this.stairs.lastX = this.stairs.x;
    this.stairs.lastY = this.stairs.y;
    this.floor.addFloors(seq.stairSeq, seq.barrSeq);
    this.stage.addChild(this.stairs, this.leves.sprite);
    this.stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', () => {
      // floor.addOneFloor(Math.floor(Math.random() + 1), Math.floor(Math.random() * 4), true);
      // this.leves.tranlateY(50);
      this.stage.update();
    });
  }

  bindEvents() {
    this.background.addEventListener('click', this.handleClick.bind(this)); // 必须有元素才会触发，点击空白区域无效
    // this.stage.addEventListener('click', this.handleClick); // 必须有元素才会触发，点击空白区域无效
  }

  handleClick(event) {
    const posX = event.stageX;
    this.stairIndex += 1;
    this.clickTimes += 1;
    let direct = -1;
    this.autoDrop();
    if (posX > (this.canvas.width / 2)) {
      this.robot.moveRight();
      direct = 1;
      this.centerFloor(-1 * moveXOffset, -1 * moveYOffset);
    } else {
      this.robot.moveLeft();
      direct = -1;
      this.centerFloor(moveXOffset, -1 * moveYOffset);
    }
    this.addStair();
    this.leves.tranlateY(-1 * moveYOffset);
    this.checkJump(direct);
  }

  centerFloor(x, y) {
    this.stairs.lastX += x;
    this.stairs.lastY += y;

    createjs.Tween.get(this.stairs, { override: true })
                  .to({
                    x: this.stairs.lastX,
                    y: this.stairs.lastY,
                  }, 500);
  }

  checkJump(direct) {
    const stairSequence = this.floor.stairSequence;

    if (direct !== stairSequence[this.stairIndex]) {
      this.drop(direct);
    }
  }

  drop(direct) {
    const barrierSequence = this.floor.barrierSequence;

    if (barrierSequence[this.stairIndex] !== 1) {
      this.robot.dropAndDisappear(direct);
    } else {
      this.shakeStairs();
      this.robot.hitAndDisappear();
    }
  }

  shakeStairs() {
    createjs.Tween.removeTweens(this.stairs);
    createjs.Tween.get(this.stairs, {
      override: true,
    }).to({
      x: this.stairs.x + 5,
      y: this.stairs.y - 5,
    }, 50, createjs.Ease.getBackInOut(2.5)).to({
      x: this.stairs.x,
      y: this.stairs.y,
    }, 50, createjs.Ease.getBackInOut(2.5)).to({
      x: this.stairs.x + 5,
      y: this.stairs.y - 5,
    }, 50, createjs.Ease.getBackInOut(2.5)).to({ // eslint-disable-line
      x: this.stairs.x,
      y: this.stairs.y,
    }, 50, createjs.Ease.getBackInOut(2.5)).pause(); // eslint-disable-line
  }

  addStair() {
    const stair = util.getRandom(0, 2);
    const barrier = util.getRandomNumBySepcial(this.config.barrProbabitiy);
    this.floor.addOneFloor(stair, barrier, true);
  }

  autoDrop() {
    if (!this.autoDropTimer) {
      this.autoDropTimer = createjs.setInterval(() => {
        this.floor.drop();
        if (this.clickTimes <= this.floor.dropIndex) {
          createjs.clearInterval(this.autoDropTimer);
          this.robot.dropAndDisappear();
        }
      }, 1000);
    }
  }
}

export default Game;

