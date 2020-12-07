// @ts-ignore
import hljs from 'highlight.js/lib/core';
// @ts-ignore
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
import CreateDom from './createDom';
import { DataLevels } from '../interfase/interfase';

hljs.registerLanguage('xml', xml);

class Level extends CreateDom {
    isMenuActive = false;

    isPrintText = true;

    isGame = true;

    levelActive = +localStorage.getItem('level') || 0;

    editor: any;

    hljs = hljs;

    levels;

    constructor(state: DataLevels[]) {
        super();
        this.levels = state;
    }

    createLevelHeader = (): HTMLDivElement => {
        this.levelHeader.classList.add('level__header', 'mdc-top-app-bar__row');

        this.levelNumber.classList.add('mdc-top-app-bar__title');
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${this.levels.length}`;

        this.levelHeader.append(
            this.createButton(
                ['level__header_button-menu', 'mdc-icon-button', 'material-icons'],
                'menu',
                'button',
                this.toggleMenu,
            ),
        );
        this.levelHeader.append(this.levelNumber);
        this.levelHeader.append(
            this.createElement('i', ['check-mark', 'material-icons', 'mdc-list-item__graphic', 'check'], 'done'),
        );
        this.levelHeader.append(
            this.createButton(
                ['level__header_button-prev', 'mdc-icon-button', 'material-icons'],
                'navigate_before',
                'button',
                this.showPrevLevel,
            ),
        );
        this.levelHeader.append(
            this.createButton(
                ['level__header_button-next', 'mdc-icon-button', 'material-icons'],
                'navigate_next',
                'button',
                this.showNextLevel,
            ),
        );

        return this.levelHeader;
    };

    createMenuLevel = (): HTMLDivElement => {
        this.containerMenu.classList.add('level__menu');
        this.listMenu.classList.add('mdc-list');
        for (let i = 0; i < this.levels.length; i += 1) {
            const item = document.createElement('li');
            item.classList.add('mdc-list-item');
            item.id = (i + 1).toString();
            item.innerHTML = `<i class="material-icons mdc-list-item__graphic" aria-hidden="true">done</i><span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">${i + 1}.${this.levels[i].syntax}</span>`;
            this.listMenu.append(item);
            item.addEventListener('click', () => {
                this.levelActive = +item.id - 1;
                this.loudNewLewel();
                this.toggleMenu();
            });
        }

        this.containerMenu.append(this.listMenu);
        return this.containerMenu;
    };

    createLevelHelp = (): HTMLDivElement => {
        this.containerHelp.innerHTML = '';
        this.containerHelp.classList.add('level__help');
        this.containerHelp.append(
            this.createElement('h2', ['selector-name'], this.levels[this.levelActive].selectorName),
            this.createElement('h3', ['title'], this.levels[this.levelActive].helpTitle),
            this.createElement('h2', ['syntax'], this.levels[this.levelActive].syntax),
            this.createElement('p', ['description'], this.levels[this.levelActive].help),
            this.createButton(['reset'], 'RESET', 'button', this.reset),
        );
        if (this.levels[this.levelActive].examples) {
            this.containerHelp.append(this.createElement('h3', ['examples'], 'Examples'));
            this.levels[this.levelActive].examples.forEach((el) =>
                this.containerHelp.append(this.createElement('div', ['example'], el)),
            );
        }
        return this.containerHelp;
    };

    reset = (): void => {
        this.levelActive = 0;
        localStorage.clear();
        this.loudNewLewel();
    };

    showNextLevel = (): void => {
        if (+this.levelActive < this.levels.length - 1) {
            this.levelActive += 1;
            this.loudNewLewel();
        }
    };

    showPrevLevel = (): void => {
        if (this.levelActive > 0) {
            this.levelActive -= 1;
            this.loudNewLewel();
        }
    };

    toggleMenu = (): void => {
        this.isMenuActive = !this.isMenuActive;
        this.containerMenu.style.left = this.isMenuActive ? '0px' : `-${this.containerMenu.offsetWidth}px`;
        this.levelHeader.children[0].textContent = this.isMenuActive ? 'close' : 'menu';
    };

    toggleListActives = (): void => {
        this.levelHeader.children[2].classList.remove('not-passed', 'passed');
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${this.levels.length}`;

        const objProgress = JSON.parse(localStorage.getItem('progress')) || {};
        if (objProgress[this.levelActive] && objProgress[this.levelActive].correct) {
            this.levelHeader.children[2].classList.add('passed');
        }
        if (objProgress[this.levelActive] && objProgress[this.levelActive].incorrect) {
            this.levelHeader.children[2].classList.add('not-passed');
        }
        this.listMenu.childNodes.forEach((item: HTMLElement, i: number) => {
            item.classList.remove('mdc-list-item--activated');
            if (+item.id === this.levelActive + 1) item.classList.add('mdc-list-item--activated');
            item.children[0].classList.remove('not-passed', 'passed');
            if (objProgress[`${i}`]) {
                if (objProgress[`${i}`].correct && !objProgress[`${i}`].incorrect) {
                    item.children[0].classList.add('passed');
                }
                if (objProgress[`${i}`].incorrect && !objProgress[`${i}`].correct) {
                    item.children[0].classList.add('not-passed');
                }
            }
        });
    };

    loudNewLewel = (): void => {
        if (this.levelActive < this.levels.length) {
            this.isGame = true;
            this.htmlCode.innerHTML = ``;
            this.editor.setValue('');
            this.editor.focus();
            this.isPrintText = true;
            this.htmlCode.append(this.getViewerCode());
            this.htmlCode.querySelectorAll('.code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            this.table.innerHTML = this.levels[this.levelActive].boardMarkup;
            document.querySelector('.layout__header').innerHTML = this.levels[this.levelActive].doThis;
            this.table.querySelectorAll('*').forEach((item: Element) => {
                if (item.closest(this.levels[this.levelActive].selector)) {
                    if (item.tagName === 'BAT' || item.className === 'red') {
                        item.closest(`.table ${this.levels[this.levelActive].selector}`).classList.add('selected-bat');
                    } else if (item.tagName === 'PUMPKIN' || item.tagName === 'SKULL' || item.tagName === 'CASPER') {
                        item.closest(`.table ${this.levels[this.levelActive].selector}`).classList.add(
                            'selected-pumpkin',
                        );
                    } else {
                        item.closest(`.table ${this.levels[this.levelActive].selector}`).classList.add(
                            'selected-element',
                        );
                    }
                }
            });
            this.containerLevel.removeChild(this.containerHelp);
            this.containerLevel.append(this.createLevelHelp());
            this.toggleListActives();
            localStorage.setItem('level', `${this.levelActive}`);
        } else {
            this.isGame = false;
            this.editor.setValue('');
            this.table.innerHTML = '';
            this.showWinningResult();
        }
    };

    showWinningResult = (): void => {
        const objProgress = JSON.parse(localStorage.getItem('progress'));
        let countCorrect = 0;
        let countIncorrect = 0;
        Object.keys(objProgress).forEach((e) => {
            if (objProgress[e].correct) countCorrect += 1;
            if (objProgress[e].incorrect) countIncorrect += 1;
        });
        const win = this.createElement('div', ['game-win'], 'YOU WIN');
        const unanswered =
            this.levels.length - countCorrect - countIncorrect === 0
                ? ''
                : this.createElement(
                      'div',
                      ['unanswered'],
                      `unanswered: ${this.levels.length - countCorrect - countIncorrect}`,
                  );
        const correct = countCorrect === 0 ? '' : this.createElement('div', ['incorrect'], `correct: ${countCorrect}`);
        const incorrect =
            countIncorrect === 0 ? '' : this.createElement('div', ['incorrect'], `wrong: ${countIncorrect}`);
        const result =
            countCorrect === this.levels.length
                ? win
                : this.createBlock('h2', ['game-over'], correct, incorrect, unanswered);
        this.table.append(result);
    };

    getAttributes = (child: any): string => {
        let childClass;
        if (child.attributes.class) {
            childClass = child.attributes.class.value
                .split(' ')
                .filter((e: string) => e !== 'selected-element' && e !== 'selected-bat' && e !== 'selected-pumpkin')
                .join('');
        }
        const childId = child.attributes.getNamedItem('id');
        const attributes = `${childClass ? ` class="${childClass}"` : ''}${
            childId && childId.value ? ` id="${childId.value}"` : ''
        }`;
        return attributes;
    };

    getElementViewerCode = (element: any): HTMLDivElement => {
        const div = document.createElement('div');
        div.classList.add('wrap');
        const openTag = `&lt${element.nodeName.toLocaleLowerCase()}${this.getAttributes(element)}>`;
        const closedTag = `&lt;/${element.nodeName.toLocaleLowerCase()}>`;
        if (element.children.length > 0) {
            div.append(this.createElement('span', ['code'], `${openTag}`));
            for (let i = 0; i < element.children.length; i += 1) {
                div.append(this.getElementViewerCode(element.children[i].cloneNode(true)));
            }
            div.append(this.createElement('span', ['code'], `${closedTag}`));
        } else {
            div.append(this.createElement('span', ['code'], `${openTag}${closedTag}`));
        }
        return div;
    };

    getViewerCode = (): DocumentFragment => {
        const result = document.createDocumentFragment();
        const container = document.createElement('div');
        container.innerHTML = this.levels[this.levelActive].boardMarkup;
        container.childNodes.forEach((element: Node) => {
            if (element.nodeType === 1) result.append(this.getElementViewerCode(element));
        });
        return result;
    };

    createBlockLevel = (): HTMLDivElement => {
        this.containerLevel.classList.add('level', 'mdc-card');
        this.containerLevel.append(this.createLevelHeader(), this.createMenuLevel(), this.createLevelHelp());
        this.toggleListActives();
        return this.containerLevel;
    };
}

export default Level;
