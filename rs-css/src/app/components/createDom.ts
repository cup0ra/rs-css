export default class CreateDom {
    levelHeader = document.createElement('div');

    containerLevel = document.createElement('div');

    containerMenu = document.createElement('div');

    levelNumber = document.createElement('span');

    listMenu = document.createElement('ul');

    containerHelp = document.createElement('div');

    input = document.createElement('input');

    table = document.createElement('section');

    htmlCode = document.createElement('div');

    formEditor = document.createElement('form');

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
            this.createElement(tagName, [`${className}__header--item`], text1),
            this.createElement(tagName, [`${className}__header--item`], text2),
        );
        return headerEditor;
    };

    createElement = (name: string, className: string[], text: string): HTMLElement => {
        const element = document.createElement(name);
        element.classList.add(...className);
        element.innerHTML = text || '';
        return element;
    };

    createButton = (className: string[], text: string, type: string, functions: any): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add(...className);
        button.innerHTML = text || '';
        button.type = type;
        button.addEventListener('click', functions);
        return button;
    };
}
