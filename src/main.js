/* eslint-disable global-require */
import Game from './Game';
import './assets/reset.css';

window.onload = () => {
  const game = new Game();
  game.init();
};
