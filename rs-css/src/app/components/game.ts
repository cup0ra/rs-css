import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/addon/display/placeholder';
import 'codemirror/theme/dracula.css';

import Level from './level';
import levels from '../../../assets/data/levelGame';

export default class Game extends Level {
    currentElem: HTMLElement | null = null;

    isPassedLevel = true;

    config = {
        theme: 'dracula',
        value: 'Type in a CSS selector',
        tabSize: 1,
        lineNumbers: false,
        mode: 'css',
    };

    createFormEditor = (): HTMLFormElement => {
        this.formEditor.classList.add('form');
        this.input.classList.add('form__input', 'blink');
        this.input.placeholder = 'Type in a CSS selector';

        const buttonEnter = document.createElement('button');
        buttonEnter.classList.add('form__button', 'mdc-button', 'mdc-button--raised');
        buttonEnter.type = 'submit';
        buttonEnter.append(this.createElement('span', ['mdc-button__label'], 'Enter'));

        this.formEditor.append(
            this.input,
            buttonEnter,
            this.createButton(
                ['form__button-help', 'mdc-icon-button', 'material-icons'],
                'help',
                'button',
                this.showAnswer,
            ),
        );

        this.formEditor.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.checkingResult();
        });

        this.input.addEventListener('input', () => {
            return this.input.value.length === 0
                ? this.input.classList.add('blink')
                : this.input.classList.remove('blink');
        });

        return this.formEditor;
    };

    checkingResult = (): void => {
        const elementsTable = Array.prototype.slice.call(this.table.querySelectorAll('*'));
        const isElements = elementsTable.every(
            (item: Element) =>
                item.closest(`.table ${this.editor.getValue()}`) ===
                item.closest(`.table ${levels[this.levelActive].selector}`),
        );

        if (isElements) {
            console.log(this.editor.getValue(), levels[this.levelActive].selector, isElements);
            this.table.querySelectorAll('*').forEach((item: Element) => {
                if (item.closest(levels[this.levelActive].selector)) {
                    console.log('start');
                    item.closest(`${levels[this.levelActive].selector}`).classList.add('win');
                    item.addEventListener('animationend', () => {
                        console.log('end');
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
            this.editor.setValue('');
            this.isPrintText = false;
            const arrayResponseLetters: string[] = levels[this.levelActive].selector.split('');
            this.input.classList.remove('blink');
            let count = 0;
            const printText = (): void => {
                if (count === arrayResponseLetters.length) return;
                this.input.value += arrayResponseLetters[count];
                this.editor.setValue(this.editor.getValue() + arrayResponseLetters[count]);
                count += 1;
                this.editor.focus();
                this.editor.setCursor(this.editor.lineCount(), 0);
                setTimeout(printText, 500);
            };
            printText();
            this.isPassedLevel = false;
        }
    };

    createLineNumber = (): HTMLDivElement => {
        const lineNumber = document.createElement('div');
        lineNumber.classList.add('line-number');
        for (let i = 0; i < 23; i += 1) {
            lineNumber.innerHTML += `${i + 1}<br>`;
        }
        return lineNumber;
    };

    showTooltip = (element: HTMLElement): void => {
        if (element.tagName) {
            const tooltipText = `<${element.tagName.toLocaleLowerCase()}${this.getAttributes(
                element,
            )}></${element.tagName.toLocaleLowerCase()}>`;
            const node = document.querySelector('.tooltip') as HTMLElement;
            node.classList.toggle('hidden');
            node.innerHTML = this.hljs.highlightAuto(tooltipText).value;
            node.style.left = `${element.getClientRects()[0].x}px`;
            node.style.top = `${element.getClientRects()[0].y - 70}px`;
        }
    };

    highlightElement = (e: any): void => {
        const elementsCode = Array.prototype.slice.call(this.htmlCode.querySelectorAll('div'));
        const elementsTable = Array.prototype.slice.call(this.table.querySelectorAll('*'));
        const index = e.target.closest('.table')
            ? elementsTable.indexOf(e.target)
            : elementsCode.indexOf(e.target.closest('.wrap'));
        if (e.type === 'mouseover') {
            if (this.currentElem) return;
            this.currentElem = e.target;
            this.showTooltip(elementsTable[index]);
            elementsTable[index].dataset.hover = true;
            elementsCode[index].classList.add('bold');
        }
        if (e.type === 'mouseout') {
            if (!this.currentElem) return;
            elementsTable[index].removeAttribute('data-hover');
            elementsCode[index].classList.remove('bold');
            this.currentElem = null;
            this.showTooltip(elementsTable[index]);
        }
    };

    createHtmlCode = (): HTMLDivElement => {
        this.htmlCode.classList.add('html-code');

        this.htmlCode.addEventListener('mouseover', (e: Event) => this.highlightElement(e));
        this.htmlCode.addEventListener('mouseout', (e: Event) => this.highlightElement(e));

        return this.htmlCode;
    };

    createTable = (): HTMLElement => {
        this.table.classList.add('table', 'mdc-card');
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
                this.createElement('div', ['moon'], ''),
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
            this.createBlock(
                'footer',
                ['footer'],
                this.createLink(['git'], 'cup0ra', 'https://github.com/cup0ra'),
                this.createLink(['rss'], '', 'https://rs.school/js/'),
            ),
            this.createElement('span', ['tooltip'], ''),
        );

        document.body.append(container);
        this.editor = CodeMirror.fromTextArea(this.input, this.config);
        this.editor.on('beforeChange', function (instance: any, change: any) {
            const newtext = change.text.join('').replace(/\n/g, '');
            change.update(change.from, change.to, [newtext]);
            return true;
        });

        this.editor.setOption('extraKeys', {
            Enter: () => {
                this.checkingResult();
            },
        });
        this.editor.getTextArea();
        this.loudNewLewel();
    };
}
