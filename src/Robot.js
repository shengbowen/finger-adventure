import prelaod from './preload';
import { bottomOffset, moveXOffset, moveYOffset } from './config';

class Robot {
  constructor(options, canvas) {
    this.config = {
      initDirect: -1,
    };
    Object.assign(this.config, options);
    this.sprite = null;
    this.canvas = canvas;
    this.lastX = 0;
    this.lastY = 0;
    this.lastDirect = this.config.initDirect;
    this.init();
  }

  init() {
    const spriteSheet = new createjs.SpriteSheet({
      images: [prelaod.getResult('player')],
      frames: {
        width: 150,
        height: 294,
        count: 17,
      },
      animations: {
        work: [0, 9, 'walk', 0.2],
        jump: [10, 16, 0, 0.5],
      },
    });
    this.sprite = new createjs.Sprite(spriteSheet);
    const bounds = this.sprite.getBounds();
    this.sprite.x = this.canvas.width / 2 - bounds.width / 2;
    this.lastX = this.sprite.x;
    this.sprite.y = this.canvas.height - bounds.height - bottomOffset - 40;
    this.lastY = this.sprite.y;
    if (this.config.initDirect === 1) {
      this.sprite.scaleX = -1;
      this.sprite.regX = 145;
    }
    // this.sprite.scaleX = -1;
  }

  move(x, y) {
    this.lastX += x;
    this.lastY += y;

    this.sprite.gotoAndPlay('jump');
    createjs.Tween.get(this.sprite, { override: true })
                  .to({
                    x: this.lastX,
                    y: this.lastY,
                  }, 200);
  }

  moveRight() {
    if (this.lastDirect !== 1) {
      this.lastDirect = 1;
      this.sprite.scaleX = -1;
      this.sprite.regX = 145;
    }
    this.move(moveXOffset, moveYOffset);
  }

  moveLeft() {
    if (this.lastDirect !== -1) {
      this.lastDirect = -1;
      this.sprite.scaleX = 1;
      this.sprite.regX = 0;
    }
    this.move(-1 * moveXOffset, moveYOffset);
  }

  dropAndDisappear(dir) {
    const posY = this.sprite.y;
    const posX = this.sprite.x;
    this.sprite.stop();
    createjs.Tween.removeTweens(this.sprite);
    createjs.Tween.get(this.sprite, { override: true })
                  .to({
                    x: posX + dir * 2 * moveXOffset,
                    y: posY + moveYOffset,
                  }, 240)
                  .to({
                    y: this.canvas.height + this.sprite.y,
                  }, 800)
                  .set({
                    visible: false,
                  });
  }

  hitAndDisappear() {
    createjs.Tween.get(this.sprite, { override: true })
                  .wait(500)
                  .set({
                    visible: false,
                  });
  }
}

export default Robot;
