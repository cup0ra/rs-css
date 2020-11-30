import Level from './level';
import levels from '../../../assets/data/levelGame';

export default class Game extends Level {
    currentElem: HTMLElement | null = null;

    isPassedLevel = true;

    createFormEditor = (): HTMLFormElement => {
        this.formEditor.classList.add('form');
        this.input.classList.add('form__input', 'blink');
        this.input.placeholder = 'Type in a CSS selector';
        this.input.type = 'text';
        this.input.focus();

        const button = document.createElement('button');
        button.classList.add('form__button', 'mdc-button', 'mdc-button--raised');
        button.type = 'submit';
        button.append(this.createElement('span', ['mdc-button__label'], 'Enter'));

        this.formEditor.append(
            this.input,
            button,
            this.createButton(
                ['form__button-help', 'mdc-icon-button', 'material-icons'],
                'help',
                'button',
                this.showAnswer,
            ),
        );

        this.formEditor.addEventListener('submit', (e: any) => {
            e.preventDefault();
            if (this.input.value === levels[this.levelActive].selector) {
                this.table.querySelectorAll('*').forEach((item: Element) => {
                    if (item.closest(levels[this.levelActive].selector)) {
                        item.closest(`${levels[this.levelActive].selector}`).classList.add('win');
                        item.addEventListener('animationend', () => {
                            this.loudNewLewel();
                        });
                    }
                });
                this.setLocalStorageProgress();
                this.levelActive += 1;
                this.isPassedLevel = true;
            } else {
                document.querySelector('.editor').classList.add('shake');
                document.querySelector('.editor').addEventListener('animationend', () => {
                    document.querySelector('.editor').classList.remove('shake');
                });
            }
        });

        this.input.addEventListener('input', () => {
            return this.input.value.length === 0
                ? this.input.classList.add('blink')
                : this.input.classList.remove('blink');
        });

        return this.formEditor;
    };

    setLocalStorageProgress = (): void => {
        const progress = JSON.parse(localStorage.getItem('progress')) || {};
        const result =
            progress[`${this.levelActive}`] && progress[`${this.levelActive}`].correct
                ? progress
                : { ...progress, [this.levelActive]: { correct: this.isPassedLevel, incorrect: !this.isPassedLevel } };
        localStorage.setItem('progress', JSON.stringify(result));
    };

    showAnswer = (): void => {
        if (this.isPrintText) {
            this.isPrintText = false;
            const arrayResponseLetters: string[] = levels[this.levelActive].selector.split('');
            this.input.classList.remove('blink');
            let count = 0;
            const printText = (): any => {
                if (count === arrayResponseLetters.length) return this.input.value;
                this.input.value += arrayResponseLetters[count];
                count += 1;
                this.input.focus();
                return setTimeout(printText, 500);
            };
            printText();
            this.isPassedLevel = false;
        }
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
        if (e.type === 'mouseover') {
            if (this.currentElem) return;
            this.currentElem = e.target;
            this.showTooltip(elementsTable[index]);
            elementsTable[index].classList.add('active');
            elementsCode[index].classList.add('bold');
        }
        if (e.type === 'mouseout') {
            if (!this.currentElem) return;
            elementsTable[index].classList.remove('active');
            elementsCode[index].classList.remove('bold');
            this.currentElem = null;
            this.showTooltip(elementsTable[index]);
        }
    };

    createHtmlCode = (): HTMLDivElement => {
        this.htmlCode.classList.add('html-code');
        this.htmlCode.append(this.getViewerCode(levels[this.levelActive].boardMarkup));

        this.htmlCode.addEventListener('mouseover', (e: any) => {
            if (e.target.className !== 'html-code') {
                this.highlightElement(e);
            }
        });
        this.htmlCode.addEventListener('mouseout', (e: any) => {
            if (e.target.className !== 'html-code') {
                this.highlightElement(e);
            }
        });
        return this.htmlCode;
    };

    createTable = (): HTMLElement => {
        this.table.classList.add('table', 'mdc-card');
        this.table.innerHTML = levels[this.levelActive].boardMarkup;
        this.table.querySelectorAll('*').forEach((item: any) => {
            if (item.closest(levels[this.levelActive].selector)) {
                item.closest(`${levels[this.levelActive].selector}`).classList.add('selected-element');
            }
        });
        this.table.addEventListener('mouseover', (e: any) => {
            if (e.target.className !== 'table mdc-card') {
                this.highlightElement(e);
            }
        });
        this.table.addEventListener('mouseout', (e: any) => {
            if (e.target.className !== 'table mdc-card') {
                this.highlightElement(e);
            }
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
                this.createElement('h2', ['layout__header'], levels[this.levelActive].doThis),
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
        container.append(
            this.createBlockLevel(),
            this.createWrapperGame(),
            this.createElement('span', ['tooltip'], ''),
        );
        document.body.append(container);
    };
}
