import { App } from './types';
import './styles.css';

export function render(content: HTMLElement, app: App) {

    if (app === 'tunnel') {
        content.innerHTML = `<div>Press 'w' | 's'</div>`;
    } 
    if (app === 'cube') {
        content.innerHTML = `
        <div class="flex flex-col items-center gap-2">
            <div>Move cubes:
                <div class="keys"> 
                   <div>w</div>
                   <div>a</div>
                   <div>s</div>
                   <div>d</div>
                   <div>shift</div>
                   <div>space</div>
                </div>
            </div>
            <div>Look:
                <div class="keys"> 
                   <div>&larr;</div>
                   <div>&darr;</div>
                   <div>&uarr;</div>
                   <div>&rarr;</div>
                </div>
                Zoom:
                <div class="keys">
                    <div>-</div>
                    <div>+</div>
                </div>
                Spawn:
                <div class="keys">
                    <div>enter</div>
                </div>
            </div>
        </div>
        `;
    }
}

