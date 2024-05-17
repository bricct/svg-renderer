import './styles.css'

const color='white'

export function render(app: HTMLElement) {

    app.innerHTML = `
    <div class="flex left-0 right-0 m-auto justify-center items-center">
    <svg id="svg" class="cursor-none" height="600" width="800" viewBox="-24 -18 48 36" xmlns="http://www.w3.org/2000/svg">
        <line id="up-left" x1="-24" y1="-18" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="down-left" x1="-24" y1="18" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="up-right" x1="24" y1="-18" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="down-right" x1="24" y1="18" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <polygon id="up-left-tri" points="-24,-17.6 -24,-18 -23.6,-18 0,0" style="fill:${color}" />
    <polygon id="down-left-tri" points="-24,17.6 -24,18 -23.6,18 0,0" style="fill:${color}" />
    <polygon id="up-right-tri" points="24,-17.6 24,-18 23.6,-18 0,0" style="fill:${color}" />
    <polygon id="down-right-tri" points="24,17.6 24,18 23.6,18 0,0" style="fill:${color}" />
    <line id="up" x1="-24" y1="-18" x2="24" y2="-18" style="stroke:${color};stroke-width:0.8" />
    <line id="right" x1="24" y1="-18" x2="24" y2="18" style="stroke:${color};stroke-width:0.8" />
    <line id="down" x1="-24" y1="18" x2="24" y2="18" style="stroke:${color};stroke-width:0.8" />
    <line id="left" x1="-24" y1="-18" x2="-24" y2="18" style="stroke:${color};stroke-width:0.8" />
    <line id="inner-up" x1="0" y1="0" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="inner-right" x1="0" y1="0" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="inner-down" x1="0" y1="0" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    <line id="inner-left" x1="0" y1="0" x2="0" y2="0" style="stroke:${color};stroke-width:0.05" />
    </svg>
    </div>
    `
    const svg = document.getElementById("svg")!;

    for (let i=0; i<2; i++) {
        for (let j=0; j<2; j++) {
            for (let k=0; k<4; k++) {
                svg.innerHTML += `<line id="${k}-${i * 2}-${(j * 2) + 1}" x1="0" y1="0" x2="0" y2="0" style="stroke:${color};stroke-width:0.${k+1}" />`
            }
        }
    }

    type Point = { x: number, y: number };

    const upLeft = document.getElementById('up-left')!;
    const downLeft = document.getElementById('down-left')!;
    const upRight = document.getElementById('up-right')!;
    const downRight = document.getElementById('down-right')!;
    const upLeftTri = document.getElementById('up-left-tri')!;
    const downLeftTri = document.getElementById('down-left-tri')!;
    const upRightTri = document.getElementById('up-right-tri')!;
    const downRightTri = document.getElementById('down-right-tri')!;
    const innerUp = document.getElementById('inner-up')!;
    const innerRight = document.getElementById('inner-right')!;
    const innerDown = document.getElementById('inner-down')!;
    const innerLeft = document.getElementById('inner-left')!;

    let number = 0;
    const numberMax = 12;

    const lines = [upLeft, upRight, downRight, downLeft];
    const triangles = [upLeftTri, upRightTri, downRightTri, downLeftTri];
    const innerLines = [innerUp, innerRight, innerDown, innerLeft];
    const fibs = [3, 5, 8, 13];
    const fibDiffs = [2, 3, 5, 8];
    const widths = [0.1, 0.2, 0.3, 0.4];
    const widthDiff = 0.1;
    const fibSum = 21;
    const speed = 0.1;

    const adjustFib = (fibIdx: number, scale: number): number => {
        const fib = fibs[fibIdx];
        const diff = fibDiffs[fibIdx];
        return adjust(fib, diff, scale);
    }

    const adjust = (fib: number, diff: number, scale: number): number => {
        return (fib + ((scale/numberMax) * diff)) / fibSum;
    }

    const adjustWidth = (width: number, scale: number): number => {
        return (width + ((scale/numberMax) * widthDiff));
    }

    const between = (l: number, u: number, x: number) => Math.max(l, (Math.min(u, x)));

    const matrix = (svg as any).getScreenCTM().inverse(); 

    let intervalId: number | null = null;

    function updateNumber(scalar: number) {
        if ((number + (speed * scalar)) <= 0 && scalar < 0) {
            number = numberMax + (number + (speed * scalar));
        } else if ((number + (speed * scalar)) >= numberMax && scalar > 0) {
            number = (number + (speed * scalar)) - numberMax;
        } else {
            number += (speed * scalar);
        }
        draw();
    }

    function startUpdatingNumber(scalar: number) {
        intervalId = setInterval(() => updateNumber(scalar), 20); // Adjust the interval as needed
    }

    function stopUpdatingNumber() {
        if (intervalId != null) clearInterval(intervalId);
    }

    let svgX: number = 0;
    let svgY: number = 0;

    function setLinePts(l: HTMLElement, from: Point, to: Point) {
        l.setAttribute('x1', from.x.toFixed(3));
        l.setAttribute('y1', from.y.toFixed(3));
        l.setAttribute('x2', to.x.toFixed(3));
        l.setAttribute('y2', to.y.toFixed(3));
    }

    function setLineWidth(l: HTMLElement, width: number) {
        l.setAttribute('style', `stroke:${color};stroke-width:${width.toFixed(3)}`);
    }

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

        const scaledWidths = widths.map((w) => adjustWidth(w, number));

        for (let from = 0; from <= 2; from+=2) {
            for (let to = 1; to <= 3; to+=2) {
                for (let i = 0; i < 4; i++)
                {
                    const l = document.getElementById(`${i}-${from}-${to}`)!;
                    setLinePts(l, pts[from][i], pts[to][i]);
                    setLineWidth(l, scaledWidths[i]);
                }
            }
        }
    }

    function drawInner() {
        const innerPts : Point[] = [];
        for (let i=0; i<4; i++) {
            const line = lines[i];
            const pt1 = { x: parseFloat(line.getAttribute('x1')!),  y: parseFloat(line.getAttribute('y1')!)};
            const diffX = svgX - pt1.x;
            const diffY = svgY - pt1.y;

            const adjustedFibRatio = adjust(3, 0, 0);
            const scaledVec : Point = { x: diffX * adjustedFibRatio, y: diffY * adjustedFibRatio };
            const newPt : Point = { x: svgX - scaledVec.x, y: svgY - scaledVec.y };
            innerPts.push(newPt);
            line.setAttribute('x2', newPt.x.toFixed(3));
            line.setAttribute('y2', newPt.y.toFixed(3));

            const triangle = triangles[i];
            const pointsArr = triangle.getAttribute('points')!.split(' ');
            pointsArr[3] = `${newPt.x.toFixed(3)},${newPt.y.toFixed(3)}`;
            const newPoints = pointsArr.join(' ');
            triangle.setAttribute('points', newPoints);
        }
        for (let i=0; i<4; i++) {
            const inner = innerLines[i];
            const p1 = innerPts[i];
            const p2 = innerPts[(i+1)%4];
            setLinePts(inner, p1, p2);
        }
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.repeat) return; // Skip repeated keydown events
        if (e.key === 'w') { // Change to the desired key
            stopUpdatingNumber();
            startUpdatingNumber(1);
        } else if (e.key === 's') 
            {
                stopUpdatingNumber();
                startUpdatingNumber(-1)
            }
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'w' || e.key === 's') { // Change to the same key used in keydown event
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

}
