
import Level from './app/components/level';
import Game from './app/components/game';
import './scss/style.scss';

const level = new Level();
const game = new Game();

const createWrapper = () => {
    const container = document.createElement('div');
    container.classList.add('wrapper');
    container.append(level.createBlockLevel(), game.createWrapperGame());
    return container;
};
document.body.append(createWrapper());


