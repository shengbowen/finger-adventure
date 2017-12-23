import preload from './preload';

class Leaves {
  constructor(options, canvas) {
    this.config = {
      transThreshold: 0,
    };
    Object.assign(this.config, options);

    this.moving = false;
    this.nextPosY1 = 0;
    this.nextPosY2 = 0;
    this.canvas = canvas;
    this.leafCon1 = null; // 树叶背景的容器
    this.leafCon2 = null;
    this.sprite = null;
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
    this.nextPosY1 = this.leafCon1.y = this.canvas.height - this.leafHeight; // eslint-disable-line
    this.leafCon2 = this.leafCon1.clone(true); //  //某些createjs版本这个方法会报 图片找不到的错误
    this.nextPosY2 = this.leafCon2.y = this.leafCon1.y - this.leafHeight; // eslint-disable-line
    this.sprite = new createjs.Container();
    this.sprite.addChild(this.leafCon1, this.leafCon2);
  }

  tranlateY(distance) {
    if (this.moving) return;
    this.moving = true;
    const threshold = this.canvas.height || this.config.transThreshold;
    const curPosY1 = this.leafCon1.y;
    const curPosY2 = this.leafCon2.y;
    this.nextPosY1 = curPosY1 + distance;
    this.nextPosY2 = curPosY2 + distance;

    if (curPosY1 >= threshold) {
      this.leafCon1.y = this.nextPosY2 - this.leafHeight;
    } else {
      createjs.Tween.get(this.leafCon1, { override: true })
                    .to({ y: this.nextPosY1 }, 500)
                    .call(() => { this.moving = false; });
    }

    if (curPosY2 >= threshold) {
      this.leafCon2.y = this.nextPosY1 - this.leafHeight;
    } else {
      createjs.Tween.get(this.leafCon2, { override: true })
                    .to({ y: this.nextPosY2 }, 500)
                    .call(() => { this.moving = false; });
    }
  }
}

export default Leaves;
