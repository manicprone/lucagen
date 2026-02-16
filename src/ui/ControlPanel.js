// ControlPanel.js — Minimal DOM overlay controls
//
// Play/pause, step, speed slider, add dot, bulk spawn, dot count, fullscreen toggle.

export default class ControlPanel {
  constructor({ onPlay, onPause, onStep, onSpeedChange, onSpawn, onAddDot, onFullscreen, worldWidth = 450, worldHeight = 270 }) {
    this._callbacks = { onPlay, onPause, onStep, onSpeedChange, onSpawn, onAddDot, onFullscreen };
    this._worldWidth = worldWidth;
    this._worldHeight = worldHeight;
    this._playing = true;
    this._el = null;
    this._countEl = null;
    this._tickEl = null;
    this._speedLabel = null;
    this._playBtn = null;
    this._addDotDialog = null;
    this._build();
  }

  _build() {
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.innerHTML = `
      <style>
        #control-panel {
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 100;
          display: flex;
          gap: 8px;
          align-items: center;
          background: rgba(10, 10, 10, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 8px 12px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          color: #aaa;
          user-select: none;
        }
        #control-panel button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: #ccc;
          padding: 4px 10px;
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        #control-panel button:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        #control-panel .sep {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
        }
        #control-panel input[type="range"] {
          width: 80px;
          accent-color: #4a9eff;
          cursor: pointer;
        }
        #control-panel input[type="number"] {
          width: 48px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 3px;
          color: #ccc;
          padding: 3px 5px;
          font-family: inherit;
          font-size: 12px;
          text-align: center;
        }
        #control-panel .stat {
          color: #666;
          font-size: 11px;
        }
        #control-panel .stat b {
          color: #999;
          font-weight: normal;
        }

        #add-dot-dialog {
          position: fixed;
          top: 48px;
          left: 12px;
          z-index: 101;
          background: rgba(10, 10, 10, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 12px 14px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          color: #aaa;
          display: none;
          flex-direction: column;
          gap: 8px;
          width: 220px;
        }
        #add-dot-dialog.visible { display: flex; }
        #add-dot-dialog label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        #add-dot-dialog label span {
          color: #666;
          font-size: 11px;
          min-width: 36px;
        }
        #add-dot-dialog input[type="text"],
        #add-dot-dialog input[type="number"] {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 3px;
          color: #ccc;
          padding: 4px 6px;
          font-family: inherit;
          font-size: 12px;
        }
        #add-dot-dialog .add-dot-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 4px;
        }
        #add-dot-dialog button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: #ccc;
          padding: 4px 12px;
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
        }
        #add-dot-dialog button:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        #add-dot-dialog button.primary {
          background: rgba(74, 158, 255, 0.2);
          border-color: rgba(74, 158, 255, 0.4);
          color: #8ac4ff;
        }
        #add-dot-dialog button.primary:hover {
          background: rgba(74, 158, 255, 0.35);
          color: #fff;
        }
      </style>
      <button id="cp-play" title="Play / Pause">||</button>
      <button id="cp-step" title="Step once">Step</button>
      <div class="sep"></div>
      <span>Speed</span>
      <input type="range" id="cp-speed" min="1" max="60" value="10">
      <span id="cp-speed-label">10/s</span>
      <div class="sep"></div>
      <button id="cp-add-dot" title="Add a single dot">+ Dot</button>
      <input type="number" id="cp-spawn-count" value="10" min="1" max="500">
      <button id="cp-spawn" title="Bulk spawn random dots">Spawn</button>
      <div class="sep"></div>
      <span class="stat">Dots: <b id="cp-dot-count">0</b></span>
      <span class="stat">Tick: <b id="cp-tick-count">0</b></span>
      <div class="sep"></div>
      <button id="cp-fullscreen" title="Toggle fullscreen">FS</button>
    `;

    document.body.appendChild(panel);
    this._el = panel;

    // Build the Add Dot dialog
    this._buildAddDotDialog();

    // Cache elements
    this._playBtn = panel.querySelector('#cp-play');
    this._countEl = panel.querySelector('#cp-dot-count');
    this._tickEl = panel.querySelector('#cp-tick-count');
    this._speedLabel = panel.querySelector('#cp-speed-label');
    const speedSlider = panel.querySelector('#cp-speed');
    const spawnCount = panel.querySelector('#cp-spawn-count');

    // Bind events
    this._playBtn.addEventListener('click', () => {
      this._playing = !this._playing;
      this._playBtn.textContent = this._playing ? '||' : '>';
      if (this._playing) {
        this._callbacks.onPlay?.();
      } else {
        this._callbacks.onPause?.();
      }
    });

    panel.querySelector('#cp-step').addEventListener('click', () => {
      this._callbacks.onStep?.();
    });

    speedSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this._speedLabel.textContent = `${val}/s`;
      this._callbacks.onSpeedChange?.(val);
    });

    panel.querySelector('#cp-add-dot').addEventListener('click', () => {
      this._toggleAddDotDialog();
    });

    panel.querySelector('#cp-spawn').addEventListener('click', () => {
      const count = parseInt(spawnCount.value, 10) || 10;
      this._callbacks.onSpawn?.(count);
    });

    panel.querySelector('#cp-fullscreen').addEventListener('click', () => {
      this._callbacks.onFullscreen?.();
    });
  }

  _buildAddDotDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'add-dot-dialog';

    const maxX = Math.max(1, this._worldWidth - 30);
    const maxY = Math.max(1, this._worldHeight - 30);

    dialog.innerHTML = `
      <label><span>Name</span><input type="text" id="add-dot-name" value="" placeholder="(auto)"></label>
      <label><span>X</span><input type="number" id="add-dot-x" value="1" min="1" max="${maxX}"></label>
      <label><span>Y</span><input type="number" id="add-dot-y" value="1" min="1" max="${maxY}"></label>
      <div class="add-dot-actions">
        <button id="add-dot-cancel">Cancel</button>
        <button id="add-dot-confirm" class="primary">Add</button>
      </div>
    `;

    document.body.appendChild(dialog);
    this._addDotDialog = dialog;

    dialog.querySelector('#add-dot-cancel').addEventListener('click', () => {
      this._hideAddDotDialog();
    });

    dialog.querySelector('#add-dot-confirm').addEventListener('click', () => {
      this._confirmAddDot();
    });

    // Enter key in any input confirms
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._confirmAddDot();
      if (e.key === 'Escape') this._hideAddDotDialog();
    });
  }

  _toggleAddDotDialog() {
    this._addDotDialog.classList.toggle('visible');
    if (this._addDotDialog.classList.contains('visible')) {
      // Focus the name field
      const nameInput = this._addDotDialog.querySelector('#add-dot-name');
      nameInput.value = '';
      nameInput.focus();
    }
  }

  _hideAddDotDialog() {
    this._addDotDialog.classList.remove('visible');
  }

  _confirmAddDot() {
    const name = this._addDotDialog.querySelector('#add-dot-name').value.trim();
    const x = parseInt(this._addDotDialog.querySelector('#add-dot-x').value, 10) || 1;
    const y = parseInt(this._addDotDialog.querySelector('#add-dot-y').value, 10) || 1;

    this._callbacks.onAddDot?.({
      name: name || undefined, // undefined lets Dot auto-generate
      x,
      y,
    });

    this._hideAddDotDialog();
  }

  updateDotCount(count) {
    if (this._countEl) this._countEl.textContent = count;
  }

  updateTickCount(count) {
    if (this._tickEl) this._tickEl.textContent = count;
  }
}
