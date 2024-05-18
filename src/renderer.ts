import './styles.css';
import { EventListener } from './types';
// const color = 'white';


type Point = { x: number, y: number, z: number };
type Line = { from: Point, to: Point };

type Point2D = { x: number, y: number };
type Line2D = { from: Point2D, to: Point2D, width: number };

const radToDeg = (radians: number): number => {
    return radians * (180 / Math.PI);
}


const magnitude = (point: Point) => {
    return Math.sqrt((point.x ** 2) + (point.y ** 2) + (point.z ** 2));
}

const invMagnitude = (point: Point) => {
    return 1 / magnitude(point);
}

const scale = ({x, y, z}: Point, scalar: number) => {
    return { x: x*scalar, y: y*scalar, z: z*scalar };
}

const normalize = (point: Point) => {
    return scale(point, invMagnitude(point));
}

const apply = (line: Line, f: (p: Point) =>  Point): Line => {
    return { from: f(line.from), to: f(line.to) };
}

const calcAngle = (point: Point, accessor: (p: Point) => number) => {
    const sin = (accessor(point)) * invMagnitude(point);
    const rad = Math.asin(sin);
    return radToDeg(rad);
}

const calcTheta = (point: Point) => {
    return calcAngle(point, point => point.y);
}

const calcPhi = (point: Point) => {
    return calcAngle(point, point => point.x);
}


export function render(app: HTMLDivElement): () => void {

    // viewing angles in degrees
    let yMin = -45;
    let yMax = 45;

    let xMin = -60;
    let xMax = 60;
    const defaultStroke = 0.4;
    const lookSpeed = 5;
    const zoomSpeed = 0.5;

    function getViewBox() {
        return `${xMin} ${yMin} ${xMax-xMin} ${yMax-yMin}` 
    }

    app.innerHTML = `
    <div class="flex left-0 right-0 m-auto justify-center items-center">
    <svg id="svg" class="cursor-none" height="600" width="800" viewBox="${getViewBox()}" xmlns="http://www.w3.org/2000/svg">
    </svg>
    </div>`

    const svg = document.getElementById("svg")!;

    let movementIntervalId: number | null = null;
    let cubePos: Point = { x: 0, y: 0, z: 1.5 };
    let cubeScale: number = 2;
    const speed = 0.1;
    

    function updatePosition(mutator: (p: Point, value: number) => void, scalar: number) {
        mutator(cubePos, (speed * scalar));
        draw();
    }

    function startUpdatingMovement(mutator: (p: Point, value: number) => void, scalar: number) {
        movementIntervalId = setInterval(() => updatePosition(mutator, scalar), 20); // Adjust the interval as needed
    }

    function stopUpdating(intervalId: number | null) {
        if (intervalId != null) clearInterval(intervalId);
    }

    function drawViewBox() {
        svg.setAttribute('viewBox', getViewBox());
    }

    function lookY(dir: number) {
        yMin += dir * lookSpeed;
        yMax += dir * lookSpeed;
        drawViewBox();
    }

    function lookX(dir: number) {
        xMin += dir * lookSpeed;
        xMax += dir * lookSpeed;
        drawViewBox();
    }

    function zoom(dir: number) {
        xMin -= dir * zoomSpeed;
        xMax += dir * zoomSpeed;
        yMin -= dir * zoomSpeed;
        yMax += dir * zoomSpeed;
        drawViewBox();
    }

    let lookXInterval: number | null = null;
    let lookYInterval: number | null = null;
    let zoomInterval: number | null = null;


    function startUpdatingLookX(scalar: number) {
        lookXInterval = setInterval(() => lookX(scalar), 20); // Adjust the interval as needed
    }

    function startUpdatingLookY(scalar: number) {
        lookYInterval = setInterval(() => lookY(scalar), 20); // Adjust the interval as needed
    }

    function startUpdatingZoom(scalar: number) {
        zoomInterval = setInterval(() => zoom(scalar), 20);
    }

    function getCube(pos: Point, scale: number): Line[] {

        const offset = scale / 2;
        const bottomLeft = { x: pos.x - offset, y: pos.y - offset, z: pos.z - offset};
        const topLeft = { x: pos.x - offset, y: pos.y + offset, z: pos.z - offset};
        const topRight = { x: pos.x + offset, y: pos.y + offset, z: pos.z - offset};
        const bottomRight = { x: pos.x + offset, y: pos.y - offset, z: pos.z - offset};

        const bottomLeftBack = { x: pos.x - offset, y: pos.y - offset, z: pos.z + offset};
        const topLeftBack = { x: pos.x - offset, y: pos.y + offset, z: pos.z + offset};
        const topRightBack = { x: pos.x + offset, y: pos.y + offset, z: pos.z + offset};
        const bottomRightBack = { x: pos.x + offset, y: pos.y - offset, z: pos.z + offset};

        const lines: Line[] = [
            { from: bottomLeft, to: topLeft }, 
            { from: topLeft, to: topRight }, 
            { from: topRight, to: bottomRight }, 
            { from: bottomRight, to: bottomLeft }, 
            { from: bottomLeft, to: bottomLeftBack },
            { from: topLeft, to: topLeftBack },
            { from: topRight, to: topRightBack },
            { from: bottomRight, to: bottomRightBack },
            { from: bottomLeftBack, to: topLeftBack }, 
            { from: topLeftBack, to: topRightBack }, 
            { from: topRightBack, to: bottomRightBack }, 
            { from: bottomRightBack, to: bottomLeftBack }, 
        ];
        return lines;
    }

    function draw() {


        const lines: Line[] = getCube(cubePos, cubeScale);

        const outLines: Line2D[] = [];

        for (const line of lines) {
            const normalized = apply(line, normalize);
            const fromTheta = calcTheta(normalized.from);
            const fromPhi = calcPhi(normalized.from);
            const toTheta = calcTheta(normalized.to);
            const toPhi = calcPhi(normalized.to);

            const outFrom = { x: fromPhi, y: -fromTheta };
            const outTo = { x: toPhi, y: -toTheta };

            const width = ((invMagnitude(line.from) + invMagnitude(line.to)) / 2) * defaultStroke;
            const outLine = { from: outFrom, to: outTo, width };

            outLines.push(outLine);
        }

        let newSvg: string = '';

        outLines.forEach((line, idx) => {
            newSvg += `<line id="${idx}" x1="${line.from.x}" y1="${line.from.y}" x2="${line.to.x}" y2="${line.to.y}" style="stroke-width:${line.width}" />`
        });

        svg.innerHTML = newSvg;
    }

    const keyDown: EventListener = {
        type: 'keydown',
        listener: (e: KeyboardEvent) => {
            if (e.repeat) return; 
            if (e.key === 'w') { 
                stopUpdating(movementIntervalId);
                startUpdatingMovement((p, v) => {if ((p.z + v) > 1) p.z += v}, 1);
            } 
            else if (e.key === 's') 
            {
                stopUpdating(movementIntervalId)
                startUpdatingMovement((p, v) => {if ((p.z + v) > 1) p.z += v}, -1);
            }
            else if (e.key === 'ArrowRight') 
            {
                stopUpdating(lookXInterval);
                startUpdatingLookX(1);
            }
            else if (e.key === 'ArrowLeft')
            {
                stopUpdating(lookXInterval);
                startUpdatingLookX(-1);
            }
            else if (e.key === 'ArrowUp') 
            {
                stopUpdating(lookYInterval);
                startUpdatingLookY(-1);
            }
            else if (e.key === 'ArrowDown')
            {
                stopUpdating(lookYInterval);
                startUpdatingLookY(1);
            }
            else if (e.key === '=')
            {
                stopUpdating(zoomInterval);
                startUpdatingZoom(-1);
            }
            else if (e.key === '-')
            {
                stopUpdating(zoomInterval);
                startUpdatingZoom(1);
            }
            else if (e.key === 'Shift') 
            {
                stopUpdating(movementIntervalId);
                startUpdatingMovement((p, v) => p.y += v, 1);
            }
            else if (e.key === ' ') 
            {
                stopUpdating(movementIntervalId);
                startUpdatingMovement((p, v) => p.y += v, -1);
            }
            else if (e.key === 'a') 
            {
                stopUpdating(movementIntervalId);
                startUpdatingMovement((p, v) => p.x += v, -1);
            }
            else if (e.key === 'd') 
            {
                stopUpdating(movementIntervalId);
                startUpdatingMovement((p, v) => p.x += v, 1);
            }
        }
    };
    
    const keyUp: EventListener = {
        type: 'keyup',
        listener: (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 's' || e.key === 'Shift' || e.key === ' ' || e.key === 'a' || e.key === 'd') { // Change to the desired key
                stopUpdating(movementIntervalId);
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                stopUpdating(lookXInterval);
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
                stopUpdating(lookYInterval);
            }
            if (e.key === '=' || e.key === '-'){
                stopUpdating(zoomInterval);
            }
        }
    };

    document.addEventListener(keyDown.type, keyDown.listener);
    document.addEventListener(keyUp.type, keyUp.listener);

    draw();

    function cleanup() {
        document.removeEventListener(keyDown.type, keyDown.listener);
        document.removeEventListener(keyUp.type, keyUp.listener);
    }

    return cleanup;
}


