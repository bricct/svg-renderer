import * as content from './content';
import * as tunnel from './tunnel';
import * as renderer from './renderer';
import * as selector from './selector';
import { App, Point } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const contentDiv = document.querySelector<HTMLDivElement>('#content')!;
const selectorDiv = document.querySelector<HTMLDivElement>('#selector')!;



let selected: App = 'cube';
let cleanup: (() => void) | null = null;

const cubePos: Point = { x: 0, y: 0, z: 1.5 };
const newCubePos = {x: 1, y: 2.5, z: 2.5};
let cubes: Point[] = [cubePos, newCubePos];
const setCubes = (newCubes: Point[]) => { cubes = newCubes };



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
        return renderer.render(app, cubes, setCubes);
    }

    return null;
}


cleanup = render();
