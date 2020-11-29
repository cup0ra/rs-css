import Level from './level';
import levels from '../../../assets/data/levelGame';

export default class Game extends Level {
    formEditor = document.createElement('form');

    table = document.createElement('section');

    htmlCode = document.createElement('div');

    currentElem: HTMLElement | null = null;

    createBlock = (tagName: string, className: string[], ...arg: any): HTMLElement => {
        const container = document.createElement(tagName);
        container.classList.add(...className);
        container.append(...arg);
        return container;
    };

    createHeaderEditorOrViewer = (tagName: string, className: string, text1: string, text2: string): HTMLElement => {
        const headerEditor = document.createElement(tagName);
        headerEditor.classList.add(`${className}__header`);
        headerEditor.append(
            this.createElement(tagName, `${className}__header--item`, text1),
            this.createElement(tagName, `${className}__header--item`, text2),
        );
        return headerEditor;
    };

    createFormEditor = (): HTMLFormElement => {
        const input = document.createElement('input');
        input.classList.add('form__input', 'blink');
        input.placeholder = 'Type in a CSS selector';
        input.type = 'text';

        const button = document.createElement('button');
        button.classList.add('form__button', 'mdc-button', 'mdc-button--raised');
        button.type = 'submit';

        const spanButton = document.createElement('span');
        spanButton.classList.add('mdc-button__label');
        spanButton.textContent = 'Enter';

        button.append(spanButton);
        this.formEditor.classList.add('form');
        this.formEditor.append(input, button);

        this.formEditor.addEventListener('submit', (e: any) => {
            e.preventDefault();
            if (input.value === levels[this.levelActive].selector) {
                this.levelActive += 1;
                this.loudNewLewel();
                input.value = '';
            }

            console.log(input.value, levels[this.levelActive].selector);
        });

        input.addEventListener('input', () => {
            input.value.length === 0 ? input.classList.add('blink') : input.classList.remove('blink');
        });

        return this.formEditor;
    };

    createLineNumber = (): HTMLDivElement => {
        const lineNumber = document.createElement('div');
        lineNumber.classList.add('line-number');
        for (let i = 0; i < 15; i += 1) {
            lineNumber.innerHTML += `${i + 1}<br>`;
        }
        return lineNumber;
    };

    showTooltip = (element: HTMLElement): void => {
        if (element.tagName) {
            const tooltipText = `&lt;${element.tagName.toLocaleLowerCase()}${this.getAttributes(
                element,
            )}>&lt/${element.tagName.toLocaleLowerCase()}>`;
            const node = document.querySelector('.tooltip') as HTMLElement;
            node.classList.toggle('hidden');
            node.innerHTML = tooltipText;
            node.style.left = `${element.getClientRects()[0].x}px`;
            node.style.top = `${element.getClientRects()[0].y - 50}px`;
        }
    };

    highlightElement = (e: any): void => {
        const elementsCode = Array.prototype.slice.call(this.htmlCode.querySelectorAll('*'));
        const elementsTable = Array.prototype.slice.call(this.table.querySelectorAll('*'));
        const index = e.toElement.tagName !== 'DIV' ? elementsTable.indexOf(e.target) : elementsCode.indexOf(e.target);
        this.showTooltip(elementsTable[index]);
        if (e.type === 'mouseover') {
            if (this.currentElem) return;
            this.currentElem = e.target;
            elementsTable[index].classList.add('active');
            elementsCode[index].classList.add('bold');
        }
        if (e.type === 'mouseout') {
            if (!this.currentElem) return;
            elementsTable[index].classList.remove('active');
            elementsCode[index].classList.remove('bold');
            this.currentElem = null;
        }
    };

    createHtmlCode = (): HTMLDivElement => {
        this.htmlCode.classList.add('html-code');
        const www = this.getViewerCode(levels[this.levelActive].boardMarkup);

        this.htmlCode.append(www);
        this.htmlCode.addEventListener('mouseover', (e: any) => {
            if (e.target.className !== 'html-code') this.highlightElement(e);
            e.stopPropagation();
        });
        this.htmlCode.addEventListener('mouseout', (e: any) => {
            if (e.target.className !== 'html-code') this.highlightElement(e);
            e.stopPropagation();
        });
        return this.htmlCode;
    };

    createTable = (): HTMLElement => {
        this.table.classList.add('table', 'mdc-card');
        this.table.innerHTML = levels[this.levelActive].boardMarkup;
        this.table.addEventListener('mouseover', (e: any) => {
            if (e.target.className !== 'table mdc-card') this.highlightElement(e);
            e.stopPropagation();
        });
        this.table.addEventListener('mouseout', (e: any) => {
            if (e.target.className !== 'table mdc-card') this.highlightElement(e);
            e.stopPropagation();
        });
        return this.table;
    };

    createWrapperGame = (): HTMLDivElement => {
        const container = document.createElement('div');
        container.classList.add('game');
        container.append(
            this.createBlock(
                'div',
                ['layout', 'mdc-card'],
                this.createElement('h2', 'layout__header', levels[this.levelActive].doThis),
                this.createTable(),
            ),
            this.createBlock(
                'div',
                ['editor', 'mdc-card'],
                this.createHeaderEditorOrViewer('div', 'editor', 'CSS Editor', 'style.css'),
                this.createBlock('div', ['editor__main'], this.createFormEditor(), this.createLineNumber()),
            ),
            this.createBlock(
                'div',
                ['viewer', 'mdc-card'],
                this.createHeaderEditorOrViewer('div', 'viewer', 'HTML viewer', 'index.html'),
                this.createBlock('div', ['viewer__main'], this.createLineNumber(), this.createHtmlCode()),
            ),
        );
        return container;
    };

    initApp = (): void => {
        const container = document.createElement('div');
        container.classList.add('wrapper');
        container.append(this.createBlockLevel(), this.createWrapperGame(), this.createElement('span', 'tooltip', ''));
        document.body.append(container);
    };
}
