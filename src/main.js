/* eslint-disable global-require */
import Game from './Game';

window.onload = () => {
  const start = document.querySelector('#start');
  const restart = document.querySelector('#restart');
  const btn_start = document.querySelector('#btn-start');
  const btn_restart = document.querySelector('#btn-restart');
  start.classList.remove('out');
  start.classList.add('in');

  btn_restart.addEventListener('click', (e) => {
    game.restart();
    restart.classList.remove('in');
    restart.classList.add('out');
    e.stopPropagation();
  });

  const game = new Game({
    initStairs: 8,
    barrProbabitiy: {
      0: 0.5,
      1: 0.2,
      2: 0.2,
      3: 0.1,
    },
    onProgress: (e) => {
      btn_start.innerHTML = `${e.target.progress * 100}%`;
    },
    onComplete: () => {
      btn_start.innerHTML = 'Start';
      btn_start.addEventListener('click', (e) => {
        game.start();
        start.classList.remove('in');
        start.classList.add('out');
        e.stopPropagation();
      });
    },
    onGameEnd: () => {
      restart.classList.remove('out');
      restart.classList.add('in');
    },
  });
};
