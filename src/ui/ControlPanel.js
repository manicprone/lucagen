// ControlPanel.js — Minimal DOM overlay controls
//
// Play/pause, step, speed slider, spawn dots, dot count, fullscreen toggle.

export default class ControlPanel {
  constructor({ onPlay, onPause, onStep, onSpeedChange, onSpawn, onFullscreen }) {
    this._callbacks = { onPlay, onPause, onStep, onSpeedChange, onSpawn, onFullscreen };
    this._playing = true;
    this._el = null;
    this._countEl = null;
    this._tickEl = null;
    this._speedLabel = null;
    this._playBtn = null;
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
      </style>
      <button id="cp-play" title="Play / Pause">||</button>
      <button id="cp-step" title="Step once">Step</button>
      <div class="sep"></div>
      <span>Speed</span>
      <input type="range" id="cp-speed" min="1" max="60" value="10">
      <span id="cp-speed-label">10/s</span>
      <div class="sep"></div>
      <input type="number" id="cp-spawn-count" value="10" min="1" max="500">
      <button id="cp-spawn">Spawn</button>
      <div class="sep"></div>
      <span class="stat">Dots: <b id="cp-dot-count">0</b></span>
      <span class="stat">Tick: <b id="cp-tick-count">0</b></span>
      <div class="sep"></div>
      <button id="cp-fullscreen" title="Toggle fullscreen">FS</button>
    `;

    document.body.appendChild(panel);
    this._el = panel;

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

    panel.querySelector('#cp-spawn').addEventListener('click', () => {
      const count = parseInt(spawnCount.value, 10) || 10;
      this._callbacks.onSpawn?.(count);
    });

    panel.querySelector('#cp-fullscreen').addEventListener('click', () => {
      this._callbacks.onFullscreen?.();
    });
  }

  updateDotCount(count) {
    if (this._countEl) this._countEl.textContent = count;
  }

  updateTickCount(count) {
    if (this._tickEl) this._tickEl.textContent = count;
  }
}
