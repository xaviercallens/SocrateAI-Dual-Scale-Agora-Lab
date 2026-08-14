"""
SocrateAI - NAMAGIRI Toy Model (Phase W4: Grenoble Nexus)
Proof of Concept: Topological Learning on Quantum Fluids
Target: Phonon-Roton Spectrum (Helium-4, ILL IN5 Proxy)
"""

import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import matplotlib.pyplot as plt
import json
import os
from datetime import datetime

class Config:
    NUM_EPOCHS = 800
    LEARNING_RATE = 0.01
    BATCH_SIZE = 32
    ALPHA_PRIME = 1.93
    NUM_POINTS = 200
    Q_RANGE = (0.0, 3.5)
    NOISE_LEVEL = 0.04
    TARGET_E0 = 0.745
    ROTON_MOMENTUM = 1.93
    OUTPUT_DIR = "output"

class NamagiriNet(nn.Module):
    def __init__(self, alpha_prime=Config.ALPHA_PRIME):
        super(NamagiriNet, self).__init__()
        self.alpha_prime = alpha_prime
        self.E0_vacuum = nn.Parameter(torch.tensor([0.0]))
        self.mlp = nn.Sequential(
            nn.Linear(2, 32),
            nn.GELU(),
            nn.Linear(32, 32),
            nn.GELU(),
            nn.Linear(32, 1),
            nn.Softplus()
        )
    
    def forward(self, Q):
        q_cos = torch.cos(self.alpha_prime * Q)
        q_sin = torch.sin(self.alpha_prime * Q)
        latent_q = torch.cat([q_cos, q_sin], dim=1)
        energy = self.E0_vacuum + self.mlp(latent_q)
        return energy
    
    def get_vacuum_energy(self):
        return self.E0_vacuum.item()

def generate_ill_in5_proxy_data(n_points=Config.NUM_POINTS, noise=Config.NOISE_LEVEL):
    Q = np.linspace(Config.Q_RANGE[0], Config.Q_RANGE[1], n_points)
    phonon = 1.8 * Q
    roton = Config.TARGET_E0 + 0.6 * (Q - Config.ROTON_MOMENTUM)**2
    maxon = roton + 0.5 * np.maximum(Q - 2.5, 0)
    
    def smooth_transition(x, x1, x2):
        return 1 / (1 + np.exp(-10 * (x - (x1 + x2) / 2)))
    
    weight_phonon_roton = smooth_transition(Q, 1.1, 1.9)
    weight_roton_maxon = smooth_transition(Q, 2.1, 2.5)
    
    E_true = (1 - weight_phonon_roton) * phonon + \
            (weight_phonon_roton - weight_roton_maxon) * roton + \
            weight_roton_maxon * maxon
    
    E_noisy = E_true + np.random.normal(0, noise, n_points)
    
    Q_tensor = torch.FloatTensor(Q).view(-1, 1)
    E_tensor = torch.FloatTensor(E_noisy).view(-1, 1)
    
    return Q_tensor, E_tensor, Q, E_true

def train_namagiri_model(config=None):
    if config:
        for key, value in config.items():
            if hasattr(Config, key.upper()):
                setattr(Config, key.upper(), value)
    
    print("Initializing NAMAGIRI Toy Model...")
    
    Q_train, E_train, Q_true, E_true = generate_ill_in5_proxy_data(
        n_points=Config.NUM_POINTS,
        noise=Config.NOISE_LEVEL
    )
    
    print(f"Generated {Config.NUM_POINTS} training points")
    print(f"Q range: {Config.Q_RANGE[0]:.2f} to {Config.Q_RANGE[1]:.2f} A^-1")
    print(f"Target E0: {Config.TARGET_E0:.3f} meV")
    
    model = NamagiriNet(alpha_prime=Config.ALPHA_PRIME)
    loss_fn = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=Config.LEARNING_RATE)
    
    history = {'loss': [], 'e0_values': [], 'epochs': []}
    
    print(f"Starting training for {Config.NUM_EPOCHS} epochs...")
    
    for epoch in range(Config.NUM_EPOCHS):
        E_pred = model(Q_train)
        loss = loss_fn(E_pred, E_train)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        if epoch % 10 == 0:
            current_e0 = model.get_vacuum_energy()
            history['loss'].append(loss.item())
            history['e0_values'].append(current_e0)
            history['epochs'].append(epoch)
            print(f"  Epoch {epoch:4d}/{Config.NUM_EPOCHS} | Loss: {loss.item():.6f} | E0: {current_e0:.4f} meV")
    
    final_e0 = model.get_vacuum_energy()
    final_loss = loss.item()
    error = abs(final_e0 - Config.TARGET_E0)
    
    print(f"Training complete! Final E0: {final_e0:.4f} meV, Error: {error:.4f} meV")
    
    history['final_e0'] = final_e0
    history['target_e0'] = Config.TARGET_E0
    history['error'] = error
    history['final_loss'] = final_loss
    
    return model, history, Q_true, E_true

def plot_results(model, history, Q_true, E_true):
    os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
    
    Q_fine = np.linspace(Config.Q_RANGE[0], Config.Q_RANGE[1], 500)
    Q_fine_tensor = torch.FloatTensor(Q_fine).view(-1, 1)
    
    model.eval()
    with torch.no_grad():
        E_pred = model(Q_fine_tensor).numpy().flatten()
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    plt.style.use('dark_background')
    fig.patch.set_facecolor('#0B0F19')
    
    ax1.plot(Q_true, E_true, 'w-', linewidth=2, alpha=0.7, label='True dispersion')
    ax1.plot(Q_fine, E_pred, '#8B5CF6', linewidth=3, label=f'NAMAGIRI (E0={model.get_vacuum_energy():.3f} meV)')
    ax1.scatter(Q_true, E_true, c='#0EA5E9', s=10, alpha=0.5, label='Training data')
    ax1.axhline(y=Config.TARGET_E0, color='#34D399', linestyle='--', linewidth=2, label=f'Roton gap (E0={Config.TARGET_E0:.3f} meV)')
    ax1.set_xlabel(r'Wave vector Q (A$^{-1}$)', fontsize=12, color='#E2E8F0')
    ax1.set_ylabel(r'Energy E (meV)', fontsize=12, color='#E2E8F0')
    ax1.set_title('Phonon-Roton Dispersion', fontsize=14, color='#E2E8F0', pad=15)
    ax1.legend(facecolor='#0B0F19', edgecolor='#334155')
    ax1.grid(True, alpha=0.1, color='#334155')
    ax1.tick_params(colors='#94A3B8')
    
    epochs = np.array(history['epochs'])
    loss_values = np.array(history['loss'])
    e0_values = np.array(history['e0_values'])
    
    ax2.plot(epochs, loss_values, 'w-', linewidth=2, alpha=0.7)
    ax2.set_yscale('log')
    ax2.set_xlabel('Epoch', fontsize=12, color='#E2E8F0')
    ax2.set_ylabel('Loss (MSE)', fontsize=12, color='#E2E8F0')
    ax2.set_title('Training Progress', fontsize=14, color='#E2E8F0', pad=15)
    ax2.grid(True, alpha=0.1, color='#334155')
    ax2.tick_params(colors='#94A3B8')
    
    ax2_inset = ax2.inset_axes([0.05, 0.65, 0.4, 0.3])
    ax2_inset.plot(epochs, e0_values, '#8B5CF6', linewidth=2)
    ax2_inset.axhline(y=Config.TARGET_E0, color='#34D399', linestyle='--', linewidth=1)
    ax2_inset.set_xlabel('Epoch', fontsize=8)
    ax2_inset.set_ylabel(r'$E_0$ (meV)', fontsize=8)
    ax2_inset.set_title('E0 Convergence', fontsize=9)
    ax2_inset.grid(True, alpha=0.2, color='#334155')
    ax2_inset.set_facecolor('#05080F')
    ax2_inset.tick_params(colors='#94A3B8', labelsize=8)
    
    plt.tight_layout()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(Config.OUTPUT_DIR, f"namagiri_dispersion_{timestamp}.png")
    plt.savefig(filename, dpi=300, facecolor='#0B0F19')
    print(f"Saved plot to: {filename}")
    plt.show()
    
    return fig

def main():
    print("="*80)
    print("SocrateAI NAMAGIRI Toy Model")
    print("Phase W4: Grenoble Nexus - Proof of Concept")
    print("="*80)
    print()
    
    model, history, Q_true, E_true = train_namagiri_model()
    plot_results(model, history, Q_true, E_true)
    
    print("="*80)
    print("NAMAGIRI Toy Model - Complete")
    print("="*80)

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    main()
