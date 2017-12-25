import preload from './preload';
import { stairYOffset, bottomOffset } from './config';
import util from './util';

class Floor {
  constructor(config, canvas) {
    this.config = {};
    this.stairSequence = [];
    this.barrierSequence = [];
    this.stairArr = [];
    this.barrierArr = [];
    this.barrierCon = null; // 障碍物容器
    this.stairCon = null; // 阶梯容器
    this.canvas = canvas;
    this.lastX = 0; // 最新一块阶梯的位置
    this.lastY = 0;
    this.dropIndex = -1;
    Object.assign(this.config, config);
    this.init();
  }

  init() {
    const spriteSheet = new createjs.SpriteSheet({
      images: [preload.getResult('stair')],
      frames: [
        [0, 0, 150, 126],
        [0, 126, 170, 180],
        [170, 126, 170, 180],
        [340, 126, 170, 180],
        [510, 126, 170, 180],
        [680, 126, 170, 180],
      ],
      animations: {
        stair: [0],
        wood: [1],
        explosive: [2],
        ice: [3],
        mushroom: [4],
        stone: [5],
      },
    });

    this.stair = new createjs.Sprite(spriteSheet, 'stair');
    this.stair.width = this.stair.getBounds().width;
    this.stair.height = this.stair.getBounds().height;

    let barriers = ['wood', 'explosive', 'ice', 'mushroom', 'stone'];
    barriers = barriers.map((item) => {
      const container = new createjs.Container();
      const st = this.stair.clone(true);
      const bar = new createjs.Sprite(spriteSheet, item);
      bar.y = st.y - 60;
      container.addChild(st, bar);
      return container;
    });

    this.barriers = barriers;

    const firstStair = this.stair.clone(true);
    firstStair.x = this.canvas.width / 2 - this.stair.width / 2; //eslint-disable-line
    firstStair.y = this.canvas.height - this.stair.height - bottomOffset;//eslint-disable-line
    this.lastX = firstStair.x;
    this.lastY = firstStair.y;

    this.stairCon = new createjs.Container();
    this.barrierCon = new createjs.Container();
    this.stairCon.addChild(firstStair);
    this.stairArr.push(firstStair);
    this.sprite = new createjs.Container();
    this.sprite.addChild(this.stairCon, this.barrierCon);
  }

  /**
   *
   *
   * @param {number} stairDirection
   * @param {number} barrierType
   * @param {boolean} animation
   * @memberof Floor
   */
  addOneFloor(stairDirection, barrierType, animation) {
    // -1 代表前一个阶梯的左边，1右边
    stairDirection = stairDirection ? 1 : -1; // eslint-disable-line
    const stair = this.stair.clone(true);
    const nextX = this.lastX + stairDirection * this.stair.width / 2; // eslint-disable-line
    const nextY = this.lastY - this.stair.height + stairYOffset;//eslint-disable-line
    stair.x = nextX;
    stair.y = nextY - 100;
    this.stairArr.push(stair);
    this.stairSequence.push(stairDirection);
    this.barrierSequence.push(barrierType);
    this.stairCon.addChild(stair);

    if (animation) {
      createjs.Tween.get(stair, { override: true })
                    .to({ y: nextY }, 200);
    } else {
      stair.y = nextY;
    }

    if (barrierType !== 0) {
      // 障碍物在阶梯的反方向
      const nextBarrierX = this.lastX + (-1 * stairDirection * this.stair.width / 2) * barrierType; //eslint-disable-line
      const nextBarrierY = this.lastY - (this.stair.height - stairYOffset) * barrierType; //eslint-disable-line
      const barrier = this.barriers[util.getRandom(0, 5)].clone(true);
      barrier.x = nextBarrierX;
      barrier.y = nextBarrierY - 100;
      this.barrierCon.addChild(barrier);
      if (animation) {
        createjs.Tween.get(barrier, { override: true })
                      .to({ y: nextBarrierY }, 200);
      } else {
        barrier.y = nextBarrierY;
      }
    }

    this.lastX = nextX;
    this.lastY = nextY;
  }

  addFloors(stairSequence, barrierSequence) {
    stairSequence.forEach((item, index) => {
      this.addOneFloor(item, barrierSequence[index], false); // 批量添加无动画
    });
    Floor.sortChildren(this.stairCon);
    Floor.sortChildren(this.barrierCon);
  }

  static sortChildren(container) {
    container.sortChildren((obj1, obj2) => {
      if (obj1.y > obj2.y) { return 1; }
      if (obj1.y < obj2.y) { return -1; }
      return 0;
    });
  }

  dropStair(stair) {
    const stairY = stair.y;
    if (!createjs.Tween.hasActiveTweens(stairY)) {
      createjs.Tween.get(stair, { override: true })
                    .to({ y: stairY + 400 }, 500)
                    .call(() => {
                      this.stairCon.removeChild(stair);
                      // createjs.Tween.removeAllTweens(stair);
                    });

      const barrierArr = this.barrierCon.children;
      const barrLen = barrierArr.length;

      for (let i = 0; i < barrLen; i += 1) {
        if (barrierArr[i].y >= stairY) {
          createjs.Tween.get(barrierArr[i], { override: true })
                        .to({ y: stairY + 400 }, 500)
                        .call(() => {
                          this.barrierCon.removeChild(barrierArr[i]);
                          // createjs.Tween.removeAllTweens(barrierArr[i]);
                          // override 就可以了， 加这句反而有bug，导致stair的的动画没有执行
                        });
        }
      }
      this.dropIndex += 1;
    }
  }

  drop() {
    const stair = this.stairArr.shift();

    stair && this.dropStair(stair); // eslint-disable-line

    while (this.stairArr.length > 9) {
      this.dropStair(this.stairArr.shift());
    }
  }
}

export default Floor;
