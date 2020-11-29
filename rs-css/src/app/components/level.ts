import data from '../../../assets/data/data.json';
import levels from '../../../assets/data/levelGame';

class Level {
    containerLevel = document.createElement('div');

    containerMenu = document.createElement('div');

    levelNumber = document.createElement('span');

    listMenu = document.createElement('ul');

    containerHelp = document.createElement('div');

    isMenuActive = false;

    levelActive = 0;

    createLevelHeader = (): HTMLDivElement => {
        const levelHeader = document.createElement('div');
        levelHeader.classList.add('level__header', 'mdc-top-app-bar__row');

        this.levelNumber.classList.add('mdc-top-app-bar__title');
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${levels.length}`;

        const checkMark = document.createElement('i');
        checkMark.classList.add('check-mark', 'material-icons', 'mdc-list-item__graphic');
        checkMark.textContent = 'done';

        const buttonMenu = document.createElement('button');
        buttonMenu.classList.add('level__header_button-menu', 'mdc-icon-button', 'material-icons');
        buttonMenu.textContent = 'menu';

        const buttonNext = document.createElement('button');
        buttonNext.classList.add('level__header_button-next', 'mdc-icon-button', 'material-icons');
        buttonNext.textContent = 'navigate_next';

        const buttonPrev = document.createElement('button');
        buttonPrev.classList.add('level__header_button-prev', 'mdc-icon-button', 'material-icons');
        buttonPrev.textContent = 'navigate_before';

        levelHeader.append(buttonMenu, this.levelNumber, checkMark, buttonPrev, buttonNext);

        buttonMenu.addEventListener('click', () => this.toggleMenu());

        buttonNext.addEventListener('click', () => {
            if (+this.levelActive <= levels.length - 1) {
                this.levelActive += 1;
                this.loudNewLewel();
            }
        });
        buttonPrev.addEventListener('click', () => {
            if (this.levelActive > 0) {
                this.levelActive -= 1;
                this.loudNewLewel();
            }
        });
        return levelHeader;
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
            this.createElement('h3', 'selector-name', levels[this.levelActive].selectorName),
            this.createElement('h2', 'title', levels[this.levelActive].helpTitle),
            this.createElement('h2', 'syntax', levels[this.levelActive].syntax),
            this.createElement('p', 'description', levels[this.levelActive].help),
        );
        if (levels[this.levelActive].examples)
            levels[this.levelActive].examples.forEach((el) =>
                this.containerHelp.append(this.createElement('div', 'example', el)),
            );
        return this.containerHelp;
    };

    createElement = (name: string, className: string, text: string): HTMLElement => {
        const element = document.createElement(name);
        element.classList.add(className);
        element.innerHTML = text || '';
        return element;
    };

    toggleMenu = (): void => {
        this.isMenuActive = !this.isMenuActive;
        this.containerMenu.style.left = this.isMenuActive ? '0px' : `-${this.containerMenu.offsetWidth}px`;
        document.querySelector('.level__header_button-menu').textContent = this.isMenuActive ? 'close' : 'menu';
    };

    toggleListActives = (): void => {
        this.levelNumber.textContent = `Level ${this.levelActive + 1} of ${levels.length}`;
        this.listMenu.childNodes.forEach((item: any) => {
            item.classList.remove('mdc-list-item--activated');
            if (+item.id === this.levelActive + 1) item.classList.add('mdc-list-item--activated');
        });
    };

    loudNewLewel = (): void => {
        document.querySelector('.html-code').innerHTML = ``;
        document.querySelector('.html-code').append(this.getViewerCode(levels[this.levelActive].boardMarkup));
        document.querySelector('.table').innerHTML = levels[this.levelActive].boardMarkup;
        document.querySelector('.layout__header').innerHTML = levels[this.levelActive].doThis;
        this.containerLevel.removeChild(this.containerHelp);
        this.containerLevel.append(this.createLevelHelp());
        this.toggleListActives();
    };

    getAttributes = (child: any): string => {
        const childClass = child.attributes.class;
        const childId = child.attributes.getNamedItem('id');
        const attributes = `${childClass && childClass.value ? ` class="${childClass.value}"` : ''}${
            childId && childId.value ? ` id="${childId.value}"` : ''
        }`;
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
        return this.containerLevel;
    };
}

export default Level;
