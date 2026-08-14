// Kramers-Wannier Simulation
let kw2Canvas, kw2Ctx, kw2Grid = [], kw2GridSize = 16, kw2AnimId = null, kw2Running = false;

function initKramers() {
    kw2Canvas = document.getElementById('kw-canvas');
    if (!kw2Canvas) return;
    kw2Ctx = kw2Canvas.getContext('2d');
    resizeKramers();
}

function resizeKramers() {
    if (kw2Canvas) {
        kw2Canvas.width = kw2Canvas.parentElement.clientWidth;
        kw2Canvas.height = kw2Canvas.parentElement.clientHeight;
    }
}

function startKramersSimulation() {
    if (kw2Running) return;
    kw2Running = true;
    const statusEl = document.getElementById('kw-status');
    if (statusEl) statusEl.innerText = 'Running...';
    
    kw2GridSize = 16;
    kw2Grid = [];
    for (let i = 0; i < kw2GridSize; i++) {
        kw2Grid[i] = [];
        for (let j = 0; j < kw2GridSize; j++) {
            kw2Grid[i][j] = Math.random() > 0.5 ? 1 : -1;
        }
    }
    
    let steps = 0;
    function step() {
        steps++;
        const numSteps = Math.min(20, kw2GridSize * kw2GridSize);
        for (let s = 0; s < numSteps; s++) {
            const i = Math.floor(Math.random() * kw2GridSize);
            const j = Math.floor(Math.random() * kw2GridSize);
            const spin = kw2Grid[i][j];
            const neighbors = getNeighbors(i, j);
            const energyChange = 2 * spin * neighbors;
            const K = 0.4407;
            if (energyChange < 0 || Math.random() < Math.exp(-energyChange / K)) {
                kw2Grid[i][j] = -spin;
            }
        }
        renderKramers();
        if (steps > 200) {
            stopKramers();
            if (statusEl) {
                statusEl.innerText = 'Complete';
                statusEl.className = 'text-emerald-400';
            }
            return;
        }
        kw2AnimId = requestAnimationFrame(step);
    }
    kw2AnimId = requestAnimationFrame(step);
}

function getNeighbors(i, j) {
    const size = kw2Grid.length;
    let sum = 0;
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    for (const [di, dj] of dirs) {
        const ni = (i + di + size) % size;
        const nj = (j + dj + size) % size;
        sum += kw2Grid[ni][nj];
    }
    return sum;
}

function renderKramers() {
    if (!kw2Canvas || !kw2Ctx) return;
    const cellSize = kw2Canvas.width / kw2GridSize;
    kw2Ctx.fillStyle = '#05080F';
    kw2Ctx.fillRect(0, 0, kw2Canvas.width, kw2Canvas.height);
    for (let i = 0; i < kw2GridSize; i++) {
        for (let j = 0; j < kw2GridSize; j++) {
            kw2Ctx.fillStyle = kw2Grid[i][j] === 1 ? '#0ea5e9' : '#f97316';
            kw2Ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

function stopKramers() {
    kw2Running = false;
    if (kw2AnimId) {
        cancelAnimationFrame(kw2AnimId);
        kw2AnimId = null;
    }
}
