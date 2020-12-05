import 'highlight.js/styles/github.css';
import Level from './app/components/level';
import Game from './app/components/game';
import './scss/style.scss';
import './scss/dracula.scss';
import './scss/table.scss';

const level = new Level();
const game = new Game();

game.initApp();
