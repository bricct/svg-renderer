import * as content from './content';
import * as tunnel from './tunnel';
import * as renderer from './renderer';
import * as selector from './selector';
import { App } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const contentDiv = document.querySelector<HTMLDivElement>('#content')!;
const selectorDiv = document.querySelector<HTMLDivElement>('#selector')!;



let selected: App = 'tunnel';
let cleanup: (() => void) | null = null;


function onChange(newSelection: App)
{
    if (newSelection !== selected) { 
        selected = newSelection;
        cleanup?.();
        content.render(contentDiv, selected);
        cleanup = render();
    }
}

selector.render(selectorDiv, onChange);
content.render(contentDiv, selected);



function render(): (() => void) | null {

    if (selected === 'tunnel') {
        return tunnel.render(app);
    }

    else if (selected === 'cube') {
        return renderer.render(app);
    }

    return null;
}


cleanup = render();
