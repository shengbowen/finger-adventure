/* eslint-disable global-require */
import Game from './Game';
import './assets/reset.css';

window.onload = () => {
  const game = new Game({
    initStairs: 8,
    barrProbabitiy: {
      0: 0.5,
      1: 0.2,
      2: 0.2,
      3: 0.1,
    },
  });
  game.init();
};
