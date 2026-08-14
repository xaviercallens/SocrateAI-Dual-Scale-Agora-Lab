// Kuramoto Model Simulation
let kwCanvas, kwCtx, kwSlider, kwCouplingDisplay, kwCoherenceDisplay, kwBar;
const N = 200;
let phases = [], freqs = [], animId = null;

function initKuramoto() {
    kwCanvas = document.getElementById('kw-main-canvas');
    if (!kwCanvas) {
        kwCanvas = document.getElementById('kw-canvas');
    }
    if (!kwCanvas) return;
    
    kwCtx = kwCanvas.getContext('2d');
    kwSlider = document.getElementById('kw-slider');
    kwCouplingDisplay = document.getElementById('kw-coupling');
    kwCoherenceDisplay = document.getElementById('kw-coherence');
    kwBar = document.getElementById('kw-bar');
    
    // Initialize oscillators
    phases = [];
    freqs = [];
    for (let i = 0; i < N; i++) {
        phases.push(Math.random() * 2 * Math.PI);
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        freqs.push(num * 0.02);
    }
    
    if (kwSlider) {
        kwSlider.addEventListener('input', updateKuramoto);
    }
    
    resizeKuramoto();
    updateKuramoto();
}

function resizeKuramoto() {
    if (kwCanvas) {
        kwCanvas.width = kwCanvas.parentElement.clientWidth;
        kwCanvas.height = kwCanvas.parentElement.clientHeight;
    }
}

function updateKuramoto() {
    if (!kwCanvas || !kwCtx) return;
    
    const K = kwSlider ? parseFloat(kwSlider.value) : 0;
    if (kwCouplingDisplay) kwCouplingDisplay.innerText = K.toFixed(1);
    
    let sumSin = 0, sumCos = 0;
    for (let i = 0; i < N; i++) {
        sumCos += Math.cos(phases[i]);
        sumSin += Math.sin(phases[i]);
    }
    const r = Math.sqrt(sumCos*sumCos + sumSin*sumSin) / N;
    const psi = Math.atan2(sumSin, sumCos);
    
    if (kwCoherenceDisplay) kwCoherenceDisplay.innerText = r.toFixed(3);
    if (kwBar) kwBar.style.width = `${r * 100}%`;
    
    for (let i = 0; i < N; i++) {
        const dTheta = freqs[i] + (K * r * Math.sin(psi - phases[i]));
        phases[i] += dTheta;
        if (phases[i] > 2*Math.PI) phases[i] -= 2*Math.PI;
        if (phases[i] < 0) phases[i] += 2*Math.PI;
    }
    
    kwCtx.fillStyle = '#05080F';
    kwCtx.fillRect(0, 0, kwCanvas.width, kwCanvas.height);
    
    const centerX = kwCanvas.width / 2;
    const centerY = kwCanvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    kwCtx.beginPath();
    kwCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    kwCtx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
    kwCtx.lineWidth = 1;
    kwCtx.stroke();
    
    for (let i = 0; i < N; i++) {
        const x = centerX + Math.cos(phases[i]) * radius;
        const y = centerY + Math.sin(phases[i]) * radius;
        kwCtx.beginPath();
        kwCtx.arc(x, y, 3, 0, Math.PI * 2);
        kwCtx.fillStyle = `rgba(167, 139, 250, ${0.4 + (r*0.6)})`;
        kwCtx.fill();
    }
    
    if (r > 0.05) {
        const vecX = centerX + Math.cos(psi) * (radius * r);
        const vecY = centerY + Math.sin(psi) * (radius * r);
        kwCtx.beginPath();
        kwCtx.moveTo(centerX, centerY);
        kwCtx.lineTo(vecX, vecY);
        kwCtx.strokeStyle = '#34d399';
        kwCtx.lineWidth = 3;
        kwCtx.stroke();
        kwCtx.beginPath();
        kwCtx.arc(vecX, vecY, 5, 0, Math.PI * 2);
        kwCtx.fillStyle = '#34d399';
        kwCtx.fill();
    }
    
    kwCtx.beginPath();
    kwCtx.arc(centerX, centerY, radius * r * 0.3, 0, Math.PI * 2);
    kwCtx.fillStyle = `rgba(52, 211, 153, ${r * 0.3})`;
    kwCtx.fill();
    
    animId = requestAnimationFrame(updateKuramoto);
}

function stopKuramoto() {
    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
    }
}
