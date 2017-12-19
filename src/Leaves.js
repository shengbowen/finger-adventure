import preload from './preload';

class Leaves {
  constructor(options, canvas) {
    this.config = {
      transThreshold: 0,
    };
    Object.assign(this.config, options);

    this.moving = false;
    this.lastPosY1 = 0;
    this.lastPosY2 = 0;
    this.canvas = canvas;
    this.leafCon1 = null; // 树叶背景的容器
    this.leafCon2 = null;
    this.container = null;
    this.leafHeight = 0;
    this.init();
  }

  init() {
    const left = new createjs.Bitmap(preload.getResult('left'));
    const right = new createjs.Bitmap(preload.getResult('right'));
    left.x = 0;
    right.x = this.canvas.width - right.getBounds().width;
    this.leafCon1 = new createjs.Container();
    this.leafCon1.addChild(left, right);
    this.leafHeight = this.leafCon1.getBounds().height;
    this.lastPosY1 = this.leafCon1.y = this.canvas.height - this.leafHeight; // eslint-disable-line
    this.leafCon2 = this.leafCon1.clone(true);
    this.lastPosY2 = this.leafCon2.y = this.leafCon1.y - this.leafHeight; // eslint-disable-line
    this.container = new createjs.Container();
    this.container.addChild(this.leafCon1, this.leafCon2);
    return this.container;
  }
}

export default Leaves;
