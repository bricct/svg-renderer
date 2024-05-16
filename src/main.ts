import './styles.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="flex gap-12">
    <div>Hello</div>
    <div>My</div>
    <div>Name</div>
    <div>Is</div>
    <div>Trey</div>
  </div>
  <h1 class="underline">HEADER</h1>
  <div>
  hello
  </div>
  <div class="text-2xl font-bold text-gray-800 mb-4">yeoeeee</div>
  <div class="absolute flex left-0 right-0 m-auto justify-center cursor-none">
  <svg id="svg" height="600" width="800" viewBox="-24 -18 48 36" xmlns="http://www.w3.org/2000/svg">
    <line id="up-left" x1="-24" y1="-18" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="down-left" x1="-24" y1="18" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="up-right" x1="24" y1="-18" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="down-right" x1="24" y1="18" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="up" x1="-24" y1="-18" x2="24" y2="-18" style="stroke:blue;stroke-width:0.1" />
    <line id="right" x1="24" y1="-18" x2="24" y2="18" style="stroke:blue;stroke-width:0.1" />
    <line id="down" x1="-24" y1="18" x2="24" y2="18" style="stroke:blue;stroke-width:0.1" />
    <line id="left" x1="-24" y1="-18" x2="-24" y2="18" style="stroke:blue;stroke-width:0.1" />
    <line id="inner-up" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="inner-right" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="inner-down" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="inner-left" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="0-0-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="1-0-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="2-0-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="3-0-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="0-0-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="1-0-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="2-0-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="3-0-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="0-2-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="1-2-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="2-2-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="3-2-1" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="0-2-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="1-2-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="2-2-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
    <line id="3-2-3" x1="0" y1="0" x2="0" y2="0" style="stroke:blue;stroke-width:0.1" />
  </div>
`

type Point = { x: number, y: number };
const svg = document.getElementById("svg")! as any;

const upLeft = document.getElementById('up-left')!;
const downLeft = document.getElementById('down-left')!;
const upRight = document.getElementById('up-right')!;
const downRight = document.getElementById('down-right')!;
const innerUp = document.getElementById('inner-up')!;
const innerRight = document.getElementById('inner-right')!;
const innerDown = document.getElementById('inner-down')!;
const innerLeft = document.getElementById('inner-left')!;

let number = 0;
const numberMax = 12;

const lines = [upLeft, upRight, downRight, downLeft];
const innerLines = [innerUp, innerRight, innerDown, innerLeft];
const fibs = [3, 5, 8, 13];
const fibDiffs = [2, 3, 5, 8];
const fibSum = 21;
// const fibRatios = fibs.map((x) => x/fibSum);

const adjustFib = (fibIdx: number, scale: number): number => {
    const fib = fibs[fibIdx];
    const diff = fibDiffs[fibIdx];
    return adjust(fib, diff, scale);
}

const adjust = (fib: number, diff: number, scale: number): number => {
    return (fib + ((scale/numberMax) * diff)) / fibSum;
}

const between = (l: number, u: number, x: number) => Math.max(l, (Math.min(u, x)));

const matrix = svg.getScreenCTM().inverse(); 

let intervalId: number | null = null;
let speed = 0.1;

function updateNumber() {
    if (number < numberMax) {
        number += speed;
    } else {
        number = 0;
    }
    draw();
}

function startUpdatingNumber() {
    intervalId = setInterval(updateNumber, 20); // Adjust the interval as needed
}

function stopUpdatingNumber() {
    if (intervalId != null) clearInterval(intervalId);
}

let svgX: number = 0;
let svgY: number = 0;

function draw() {
    const pts : Point[][] = [];
    for (const line of lines) {
        const pt1 = { x: parseFloat(line.getAttribute('x1')!),  y: parseFloat(line.getAttribute('y1')!)};
        const diffX = svgX - pt1.x;
        const diffY = svgY - pt1.y;

        const sidePts : Point[] = [];
        for (let i = 0; i < 4; i++) {
            const adjustedFibRatio = adjustFib(i, number);
            const scaledVec : Point = { x: diffX * adjustedFibRatio, y: diffY * adjustedFibRatio };
            const newPt : Point = { x: svgX - scaledVec.x, y: svgY - scaledVec.y };
            sidePts.push(newPt);
        }
        pts.push(sidePts);
    }

    for (let from = 0; from <= 2; from+=2) {
        for (let to = 1; to <= 3; to+=2) {
            for (let i = 0; i < 4; i++)
            {
                const l = document.getElementById(`${i}-${from}-${to}`)!;
                l.setAttribute('x1', pts[from][i].x.toFixed(3));
                l.setAttribute('y1', pts[from][i].y.toFixed(3));
                l.setAttribute('x2', pts[to][i].x.toFixed(3));
                l.setAttribute('y2', pts[to][i].y.toFixed(3));
            }
        }
    }
}


function drawInner() {


    const innerPts : Point[] = [];
    for (const line of lines) {
        const pt1 = { x: parseFloat(line.getAttribute('x1')!),  y: parseFloat(line.getAttribute('y1')!)};
        const diffX = svgX - pt1.x;
        const diffY = svgY - pt1.y;

        const adjustedFibRatio = adjust(3, 0, 0);
        const scaledVec : Point = { x: diffX * adjustedFibRatio, y: diffY * adjustedFibRatio };
        const newPt : Point = { x: svgX - scaledVec.x, y: svgY - scaledVec.y };
        innerPts.push(newPt);
        line.setAttribute('x2', newPt.x.toFixed(3));
        line.setAttribute('y2', newPt.y.toFixed(3));
    }
    for (let i=0; i<4; i++) {
        const inner = innerLines[i];
        const p1 = innerPts[i];
        const p2 = innerPts[(i+1)%4];
        inner.setAttribute('x1', p1.x.toFixed(3));
        inner.setAttribute('y1', p1.y.toFixed(3));
        inner.setAttribute('x2', p2.x.toFixed(3));
        inner.setAttribute('y2', p2.y.toFixed(3));

    }
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.repeat) return; // Skip repeated keydown events
    if (e.key === 'w') { // Change to the desired key
        startUpdatingNumber();
    }
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'w') { // Change to the same key used in keydown event
        stopUpdatingNumber();
    }
});

svg.addEventListener('mousemove', (e: MouseEvent) => {
    // Get mouse coordinates relative to the viewport
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Transform client coordinates to SVG coordinate space
    svgX = between(-18, 18, 0 - ((matrix.a * clientX) + (matrix.c * clientY) + matrix.e));
    svgY = between(-12, 12, 0 - ((matrix.b * clientX) + (matrix.d * clientY) + matrix.f));

    draw();
    drawInner();
});

draw();
drawInner();
