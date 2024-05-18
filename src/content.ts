import { App } from './types';

export function render(content: HTMLElement, app: App) {

    if (app === 'tunnel') {
        content.innerHTML = `<div>Press 'w' | 's'</div>`;
    } 
    if (app === 'cube') {
        content.innerHTML = `
        <div class="flex flex-col items-center gap-2">
            <div>Move cube: 'w' | 'a' | 's' | 'd' | 'shift' | 'space' </div>
            <div class="inline-block" >Look: '<' | '^' | 'v' | '>' </div>
        </div>
        `;
    }
}
