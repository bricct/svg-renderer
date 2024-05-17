import { App } from './types';


export function render(selector: HTMLDivElement, onChange: (selection: App) => void): void {

    selector.innerHTML = `
        <div class='inline-block'>
            <button id='tunnel-button'>Tunnel</button>
            <button id='cube-button'>Cube</button>
        </div>`


    const tunnelButton = selector.querySelector<HTMLButtonElement>('#tunnel-button')!;
    const cubeButton = selector.querySelector<HTMLButtonElement>('#cube-button')!;

    tunnelButton.onclick = () => onChange('tunnel');
    cubeButton.onclick = () => onChange('cube');
}
