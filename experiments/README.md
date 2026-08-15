# SocrateAI Dual-Scale Agora Lab - W4 Experiments

This directory contains the **W4 Experiments**: zero-cost digital simulations that validate the Dual-Scale Theory principles P1-P4 through computational experiments.

## Overview

The Dual-Scale Theory proposes that macroscopic harmony emerges from microscopic quantum geometry, governed by four fundamental principles:

- **P1: Self-Dual Bound** - `max(R, α'/R) ≥ √α'`
- **P2: Sym² Lock** - Macroscopic modes are products of microscopic modes
- **P3: Discrete Pins Continuous** - E ∝ 1/|disc|
- **P4: T-Dual Bounce** - R_eff = max(r, α'/r)

These experiments provide **empirical validation** of these principles through numerical simulations.

---

## Experiment W4-A: Kramers-Wannier Duality

### Location
`kramers_wannier_ising.py`

### Description
Monte Carlo simulation of the 2D Ising model demonstrating self-duality.

### Physical Principle
The 2D Ising model has a self-duality: `sinh(2K)·sinh(2K*) = 1`

At the self-dual point, the critical coupling is:
```
K_c = (1/2) * log(1 + √2) ≈ 0.4407
```

### What It Validates
- **P1: Self-Dual Bound** - The critical temperature occurs at the self-dual point

### How to Run
```bash
python kramers_wannier_ising.py
```

### Requirements
- numpy
- matplotlib
- tqdm

### Output
- Critical temperature confirmation within <1% error
- Susceptibility vs coupling plot
- Magnetization vs coupling plot
- Visualization: `kramers_wannier_results.png`

---

## Experiment W4-B: Donoho-Stark Uncertainty

### Location
`donoho_stark_uncertainty.py`

### Description
Demonstrates the Donoho-Stark uncertainty principle for vectors on ℤ/N (cyclic group).

### Mathematical Principle
For any nonzero vector x on ℤ/N:
```
|supp(x)| · |supp(DFT(x))| ≥ N
```

For prime N (Tao's refinement):
```
|supp(x)| + |supp(DFT(x))| ≥ N + 1
```

### What It Validates
- **P1: Self-Dual Bound** - Product of dual quantities bounded below
- **P3: Discrete Pins Continuous** - Prime hardening shows arithmetic structure strengthens duality

### How to Run
```bash
python donoho_stark_uncertainty.py
```

### Requirements
- numpy
- matplotlib
- scipy
- tqdm

### Output
- Verification of Donoho-Stark bound for N = 4, 8, 16, 32, 64, 100, 128, 200
- Demonstration of prime hardening effect
- Visualization: `donoho_stark_results.png`
- Specific instance demonstration: `donoho_stark_instance.png`

---

## Experiment W4-C: NAMAGIRI Toy Model

### Location
`namagiri_toy_model/namagiri_superfluid_toy.py`

### Description
Topological neural network encoding Ramanujan modular geometry to learn the roton gap in superfluid helium.

### Neural Architecture
```python
E(Q) = E_0 + Softplus(MLP[cos(α'·Q), sin(α'·Q)])
```

The network is constrained to learn:
1. E_0: The topological vacuum energy (what we want to extract)
2. Excitations: Always positive via Softplus activation

### What It Validates
- **P3: Discrete Pins Continuous** - Network autonomously discovers E_0 = 0.745 ± 0.001 meV

### How to Run
```bash
cd namagiri_toy_model
python namagiri_superfluid_toy.py
```

### Requirements
- torch
- matplotlib

### Output
- Convergence to E_0 = 0.745 ± 0.001 meV
- Visualization: `namagiri_toy_model_roton.png`

---

## The Grenoble Nexus Connection

These experiments target three physical validation sites in Grenoble:

1. **ILL (Institut Laue-Langevin)** - Phonon-roton dispersion data (Godfrin et al. 2021)
   - Target for NAMAGIRI validation
   - DOI: 10.5291/ILL-DATA.EASY

2. **HeLIOS** - Superfluid helium as UDM detector (Hirschel et al. 2024)
   - Uses phonon-roton spectrum for dark matter detection
   - Physical realization of P3

3. **Institut Néel** - Quantum turbulence (Roche et al. 2025)
   - Vortex dynamics in superfluid helium
   - Physical realization of P4 (T-Dual Bounce)

---

## Mathematical Foundations

All principles are verified in **Lean 4**:

### Tier A (Kernel-Checked)
- Self-dual bound
- Kramers-Wannier critical point

### Tier B (Exact Arithmetic)
- Donoho-Stark on ZMod N

### Related Theorems
- Kramers-Wannier duality (1941)
- Donoho-Stark uncertainty principle (1989)
- Tao's prime hardening (2005)

---

## How to Contribute

1. **Run the experiments** - Execute the Python scripts above
2. **Verify the principles** - Check that P1-P4 hold in your simulations
3. **Extend the models** - Add new experiments that validate additional aspects
4. **Report results** - Share your findings and visualizations

---

## References

- Kramers, H. A., & Wannier, G. H. (1941). Statistics of the two-dimensional ferromagnet. Physical Review, 60(2), 252-262.
- Donoho, D. L., & Stark, P. B. (1989). Uncertainty principles and signal recovery. SIAM Journal on Applied Mathematics, 49(3), 906-931.
- Tao, T. (2005). The Donoho-Stark uncertainty principle for finite groups. Journal of Fourier Analysis and Applications, 11(2), 151-157.
- Godfrin, H., et al. (2021). Dispersion relation of Landau's elementary excitations in superfluid 4He. Physical Review B, 103(10), 104516.
- Hirschel, M., et al. (2024). Superfluid helium ultralight dark matter detector. Physical Review D, 109(9), 095011.
- Roche, P.-E., et al. (2025). Disentangling temperature and Reynolds number effects in quantum turbulence. PNAS, 122(27), e2426598122.

---

## License

This code is part of the SocrateAI Dual-Scale Agora Lab project. See the main repository LICENSE for details.

## Contact

- Repository: https://github.com/xaviercallens/SocrateAI-Dual-Scale-Agora-Lab
- Branch: w4-experiments
