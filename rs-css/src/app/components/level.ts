import data from '../../../assets/data/data.json';
import levels from '../../../assets/data/levelGame';
import CreateDom from './createDom';

class Level extends CreateDom {
    isMenuActive = false;

    isPrintText = true;

    levelActive = +localStorage.getItem('level') || 0;

    createLevelHeader = (): HTMLDivElement => {
        this.levelHeader.classList.add('level__header', 'mdc-top-app-bar__row');

        this.levelNumber.classList.add('mdc-top-app-bar__title');
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${levels.length}`;

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

        for (let i = 0; i < levels.length; i += 1) {
            const item = document.createElement('li');
            item.classList.add('mdc-list-item', this.levelActive + 1 === i + 1 ? 'mdc-list-item--activated' : null);
            item.id = (i + 1).toString();
            item.innerHTML = `<i class="material-icons mdc-list-item__graphic" aria-hidden="true">done</i><span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">${i + 1}.${levels[i].syntax}</span>`;
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
            this.createElement('h3', ['selector-name'], levels[this.levelActive].selectorName),
            this.createElement('h2', ['title'], levels[this.levelActive].helpTitle),
            this.createElement('h2', ['syntax'], levels[this.levelActive].syntax),
            this.createElement('p', ['description'], levels[this.levelActive].help),
        );
        if (levels[this.levelActive].examples)
            levels[this.levelActive].examples.forEach((el) =>
                this.containerHelp.append(this.createElement('div', ['example'], el)),
            );
        return this.containerHelp;
    };

    showNextLevel = (): void => {
        if (+this.levelActive <= levels.length - 1) {
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
        document.querySelector('.level__header_button-menu').textContent = this.isMenuActive ? 'close' : 'menu';
    };

    toggleListActives = (): void => {
        this.levelHeader.children[2].classList.remove('not-passed', 'passed');
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${levels.length}`;

        const objProgress = JSON.parse(localStorage.getItem('progress'));
        if (objProgress[this.levelActive] && objProgress[this.levelActive].correct) {
            this.levelHeader.children[2].classList.add('passed');
        }
        if (objProgress[this.levelActive] && objProgress[this.levelActive].incorrect) {
            this.levelHeader.children[2].classList.add('not-passed');
        }
        this.listMenu.childNodes.forEach((item: any, i: number) => {
            item.classList.remove('mdc-list-item--activated');
            if (+item.id === this.levelActive + 1) item.classList.add('mdc-list-item--activated');
            if (objProgress[`${i}`]) {
                item.children[0].classList.remove('not-passed', 'passed');
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
        this.htmlCode.innerHTML = ``;
        this.input.value = '';
        this.input.classList.add('blink');
        this.input.focus();
        this.isPrintText = true;
        this.htmlCode.append(this.getViewerCode(levels[this.levelActive].boardMarkup));
        this.table.innerHTML = levels[this.levelActive].boardMarkup;
        document.querySelector('.layout__header').innerHTML = levels[this.levelActive].doThis;
        this.table.querySelectorAll('*').forEach((item: Element) => {
            if (item.closest(levels[this.levelActive].selector)) {
                item.closest(`${levels[this.levelActive].selector}`).classList.add('selected-element');
            }
        });
        this.containerLevel.removeChild(this.containerHelp);
        this.containerLevel.append(this.createLevelHelp());
        this.toggleListActives();
        localStorage.setItem('level', `${this.levelActive}`);
    };

    getAttributes = (child: any): string => {
        const childClass = child.attributes.class;
        const childId = child.attributes.getNamedItem('id');
        const attributes = `${
            childClass && childClass.value && childClass && childClass.value !== 'selected-element'
                ? ` class="${childClass.value}"`
                : ''
        }${childId && childId.value ? ` id="${childId.value}"` : ''}`;
        return attributes;
    };

    getViewerCode = (item: any): DocumentFragment => {
        const container = document.createElement('div');
        typeof item === 'string' ? (container.innerHTML = item) : container.append(item);
        const result = typeof item === 'string' ? document.createDocumentFragment() : item;
        const arrayContainer = Array.prototype.slice
            .call(container.childNodes)
            .filter((e: any) => e.nodeName !== '#text');
        for (let i = 0; i < arrayContainer.length; i += 1) {
            const div = document.createElement('div');
            const child = arrayContainer[i];
            if (child.children.length > 0) {
                div.append(`<${child.nodeName.toLocaleLowerCase()}${this.getAttributes(child)}>`);
                for (let j = 0; j < child.children.length; j += 1) {
                    div.append(this.getViewerCode(child.children[j].cloneNode(true)).firstChild);
                }
                div.append(`</${child.nodeName.toLocaleLowerCase()}>`);
            } else {
                div.append(child.outerHTML);
            }
            result.append(div);
        }
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
