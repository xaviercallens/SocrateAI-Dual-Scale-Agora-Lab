// Moiré Simulation
let moireCanvas, moireCtx, moireSlider, moireAngle;

function initMoire() {
    moireCanvas = document.getElementById('moire-canvas');
    if (!moireCanvas) return;
    moireCtx = moireCanvas.getContext('2d');
    moireSlider = document.getElementById('moire-slider');
    moireAngle = document.getElementById('moire-angle');
    
    if (moireSlider) {
        moireSlider.addEventListener('input', renderMoire);
    }
    
    resizeMoire();
    renderMoire();
}

function resizeMoire() {
    if (moireCanvas) {
        moireCanvas.width = moireCanvas.parentElement.clientWidth;
        moireCanvas.height = moireCanvas.parentElement.clientHeight;
    }
}

function drawHexLattice(ctx, angle, color, spacing = 10) {
    ctx.save();
    ctx.translate(moireCanvas.width / 2, moireCanvas.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = color;
    
    const limit = Math.max(moireCanvas.width, moireCanvas.height) / 1.5;
    const steps = Math.ceil(limit / spacing);
    
    for (let q = -steps; q <= steps; q++) {
        for (let r = -steps; r <= steps; r++) {
            const x = spacing * Math.sqrt(3) * (q + r/2);
            const y = spacing * 1.5 * r;
            if (x*x + y*y < limit*limit) {
                ctx.beginPath();
                ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    ctx.restore();
}

function renderMoire() {
    if (!moireCanvas || !moireCtx) return;
    
    const angle = moireSlider ? parseFloat(moireSlider.value) : 0;
    if (moireAngle) moireAngle.innerText = angle.toFixed(2) + "°";
    
    resizeMoire();
    moireCtx.clearRect(0, 0, moireCanvas.width, moireCanvas.height);
    moireCtx.globalCompositeOperation = "lighter";
    
    drawHexLattice(moireCtx, 0, "rgba(34, 211, 238, 0.7)");
    drawHexLattice(moireCtx, angle, "rgba(217, 70, 239, 0.7)");
    
    moireCtx.globalCompositeOperation = "source-over";
}

window.addEventListener('resize', () => {
    if (document.getElementById('moire-section')?.classList.contains('hidden') === false) {
        renderMoire();
    }
});
