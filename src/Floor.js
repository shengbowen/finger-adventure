import preload from './preload';

class Floor {
  constructor(config, canvas) {
    this.config = {};
    this.stariSequence = [];
    this.barrierSequence = [];
    this.stairArr = [];
    this.barrierArr = [];
    this.barrierCon = null; // 障碍物容器
    this.stairCon = null; // 阶梯容器
    this.canvas = canvas;
    Object.assign(this.config, config);
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

    const stair = new createjs.Sprite(spriteSheet, 'stair');
    const stairWidth = stair.getBounds().width;
    const stairHeight = stair.getBounds().height;

    let barriers = ['wood', 'explosive', 'ice', 'mushroom', 'stone'];
    barriers = barriers.map((item) => {
      const container = new createjs.Container();
      const st = stair.clone(true);
      const bar = new createjs.Sprite(spriteSheet, item);
      bar.y = st.y - 60;
      container.addChild(st, bar);
      return container;
    });

    this.barriers = barriers;

    const firstStair = stair.clone(true);
    firstStair.x = this.canvas.width / 2 - stairWidth / 2; //eslint-disable-line
    firstStair.y = this.canvas.height - stairHeight - 300;
    this.stairCon = new createjs.Container();
    this.barrierCon = new createjs.Container();
    this.stairCon.addChild(firstStair);
    this.stairArr.push(firstStair);
    this.instance = new createjs.Container();
    this.instance.addChild(this.stairCon, this.barrierCon);
  }
}

export default Floor;
