// Donoho-Stark Simulation
let dsCanvas, dsCtx, dsAnimId = null, dsRunning = false;

function initDonoho() {
    dsCanvas = document.getElementById('ds-canvas');
    if (!dsCanvas) return;
    dsCtx = dsCanvas.getContext('2d');
    resizeDonoho();
}

function resizeDonoho() {
    if (dsCanvas) {
        dsCanvas.width = dsCanvas.parentElement.clientWidth;
        dsCanvas.height = dsCanvas.parentElement.clientHeight;
    }
}

function startDonohoSimulation() {
    if (dsRunning) return;
    dsRunning = true;
    const statusEl = document.getElementById('ds-status');
    if (statusEl) {
        statusEl.innerText = 'Running...';
        statusEl.className = 'text-pink-400';
    }
    
    const N = 101;
    const vector = generateVector(N, 'random');
    const supportX = countSupport(vector);
    const dft = computeDFT(vector);
    const supportXhat = countSupport(dft);
    const product = supportX * supportXhat;
    const isPrime = checkPrime(N);
    
    const canvas = dsCanvas;
    const ctx = dsCtx;
    if (!canvas || !ctx) return;
    
    const barWidth = canvas.width / N / 2;
    const maxHeight = canvas.height / 2;
    
    ctx.fillStyle = '#05080F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0ea5e9';
    for (let i = 0; i < N; i++) {
        const height = Math.abs(vector[i]) * maxHeight;
        ctx.fillRect(i * barWidth * 2, canvas.height / 2 - height, barWidth, height);
    }
    
    ctx.fillStyle = '#f97316';
    for (let i = 0; i < N; i++) {
        const height = Math.abs(dft[i]) * maxHeight * 0.1;
        ctx.fillRect(i * barWidth * 2, canvas.height / 2 + 10, barWidth, height);
    }
    
    if (statusEl) {
        statusEl.innerText = 'Complete';
        statusEl.className = 'text-emerald-400';
    }
    
    dsRunning = false;
}

function generateVector(N, type) {
    const vector = new Array(N).fill(0);
    switch (type) {
        case 'random':
            for (let i = 0; i < N; i++) {
                vector[i] = Math.random() > 0.7 ? 1 : 0;
            }
            break;
        case 'sparse':
            const numSparse = Math.max(1, Math.floor(N / 10));
            for (let i = 0; i < numSparse; i++) {
                vector[Math.floor(Math.random() * N)] = 1;
            }
            break;
        case 'delta':
            vector[0] = 1;
            break;
    }
    return vector;
}

function countSupport(vector) {
    let count = 0;
    for (const v of vector) {
        if (Math.abs(v) > 1e-10) count++;
    }
    return count;
}

function computeDFT(vector) {
    const N = vector.length;
    const dft = new Array(N).fill(0);
    for (let k = 0; k < N; k++) {
        let sum = 0;
        for (let n = 0; n < N; n++) {
            const angle = -2 * Math.PI * k * n / N;
            sum += vector[n] * (Math.cos(angle) + 1i * Math.sin(angle));
        }
        dft[k] = Math.sqrt(sum.real * sum.real + (sum.imag || 0) * (sum.imag || 0));
    }
    return dft;
}

function checkPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function stopDonohoSimulation() {
    dsRunning = false;
    if (dsAnimId) {
        cancelAnimationFrame(dsAnimId);
        dsAnimId = null;
    }
}
