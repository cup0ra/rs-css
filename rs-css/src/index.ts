import Game from './app/components/game';
import './scss/style.scss';
import './scss/dracula.scss';
import './scss/table.scss';
import levels from '../assets/data/levelGame';

window.addEventListener('DOMContentLoaded', () => {
    function preloadImages(...images: string[]) {
        images.forEach((e) => {
            const image = new Image();
            image.src = e;
        });
    }
    preloadImages(
        './img/bat-red.gif',
        './img/bat.gif',
        './img/Casper.png',
        './img/earth.jpg',
        './img/grass.png',
        './img/pumpkin.png',
        './img/rip.png',
        './img/skull.png',
        './img/tombstone.png',
    );
    const game = new Game(levels);
    game.initApp();
});
