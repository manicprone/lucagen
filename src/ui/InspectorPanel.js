// InspectorPanel.js — Click-to-inspect dot details
//
// Shows: name, position, direction, shift memory, step contracts,
// emotional config grid (visual + numeric), convictions.

import EmotionalConfig from '../models/EmotionalConfig.js';
import { getEmotionalColor } from '../config/emotional-palette.js';

export default class InspectorPanel {
  constructor() {
    this._el = null;
    this._dot = null;
    this._visible = false;
    this._build();
  }

  _build() {
    const panel = document.createElement('div');
    panel.id = 'inspector-panel';
    panel.innerHTML = `
      <style>
        #inspector-panel {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 100;
          width: 260px;
          background: rgba(10, 10, 10, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 12px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          color: #aaa;
          display: none;
          user-select: none;
        }
        #inspector-panel.visible { display: block; }
        #inspector-panel .ip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        #inspector-panel .ip-name {
          font-size: 13px;
          color: #ddd;
        }
        #inspector-panel .ip-close {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
        }
        #inspector-panel .ip-close:hover { color: #fff; }
        #inspector-panel .ip-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        #inspector-panel .ip-label { color: #666; }
        #inspector-panel .ip-value { color: #bbb; }
        #inspector-panel .ip-section {
          margin-top: 10px;
          margin-bottom: 4px;
          color: #555;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        #inspector-panel .ip-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin: 6px 0;
          width: 90px;
        }
        #inspector-panel .ip-cell {
          width: 28px;
          height: 28px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.06);
        }
        #inspector-panel .ip-contracts {
          font-size: 10px;
          color: #777;
          max-height: 60px;
          overflow-y: auto;
          word-break: break-all;
        }
      </style>
      <div class="ip-header">
        <span class="ip-name" id="ip-name"></span>
        <button class="ip-close" id="ip-close">&times;</button>
      </div>
      <div id="ip-body"></div>
    `;

    document.body.appendChild(panel);
    this._el = panel;

    panel.querySelector('#ip-close').addEventListener('click', () => {
      this.hide();
    });
  }

  inspect(dot) {
    this._dot = dot;
    this._visible = true;
    this._el.classList.add('visible');
    this._render();
  }

  hide() {
    this._dot = null;
    this._visible = false;
    this._el.classList.remove('visible');
  }

  // Called each frame to update live data
  update() {
    if (!this._visible || !this._dot) return;
    this._render();
  }

  _render() {
    const dot = this._dot;
    if (!dot) return;

    this._el.querySelector('#ip-name').textContent = dot.name;

    const ec = dot.emotionalConfig;
    const gridHTML = this._buildGrid(ec);
    const contractCount = dot.stepContracts.members
      ? Object.keys(dot.stepContracts.members).length
      : 0;
    const conviction = dot.convictions.step;

    const body = this._el.querySelector('#ip-body');
    body.innerHTML = `
      <div class="ip-row"><span class="ip-label">ID</span><span class="ip-value">${dot.id}</span></div>
      <div class="ip-row"><span class="ip-label">Position</span><span class="ip-value">(${dot.x1}, ${dot.y1})</span></div>
      <div class="ip-row"><span class="ip-label">Direction</span><span class="ip-value">${dot.currentDirection ?? 'none'}</span></div>
      <div class="ip-row"><span class="ip-label">Steps</span><span class="ip-value">${dot.steps}</span></div>
      <div class="ip-row"><span class="ip-label">Events</span><span class="ip-value">${dot.events}</span></div>
      <div class="ip-row"><span class="ip-label">Interactions</span><span class="ip-value">${dot.totalInteractions}</span></div>
      <div class="ip-row"><span class="ip-label">Shift memory</span><span class="ip-value">${dot.moveShiftHistory.join(' ') || 'none'}</span></div>

      <div class="ip-section">Emotional Config</div>
      ${gridHTML}
      <div class="ip-row"><span class="ip-label">Bloom</span><span class="ip-value">${(ec.getBloomLevel() * 100).toFixed(0)}%</span></div>

      <div class="ip-section">Contracts (${contractCount})</div>
      <div class="ip-contracts">${this._formatContracts(dot)}</div>

      <div class="ip-section">Conviction</div>
      <div class="ip-contracts">${conviction ? this._formatConviction(conviction) : 'none'}</div>
    `;
  }

  _buildGrid(ec) {
    const keys = EmotionalConfig.ALL_KEYS;
    const labels = ['x', 's', 'y', 'L', 'd', 'R', 'o', 'n', 'g'];
    let html = '<div class="ip-grid">';

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = ec[key];
      const { color } = getEmotionalColor(key, val);
      const hexColor = val > 0 ? `#${color.toString(16).padStart(6, '0')}` : 'rgba(255,255,255,0.03)';
      const alpha = val > 0 ? Math.max(0.3, val / 3) : 0.15;
      const numDisplay = val > -1 ? val.toFixed(1) : '-';

      html += `<div class="ip-cell" style="background:${hexColor};opacity:${alpha}" title="${labels[i]}=${numDisplay}">${labels[i]}<br>${numDisplay}</div>`;
    }

    html += '</div>';
    return html;
  }

  _formatContracts(dot) {
    const members = dot.stepContracts.members;
    if (!members) return 'none';
    const ids = Object.keys(members);
    if (ids.length === 0) return 'none';

    return ids.map(id => {
      const c = members[id];
      return `${id}: ${c.intent ?? '?'}${c.satisfied ? ' (done)' : ''}`;
    }).join('<br>');
  }

  _formatConviction(c) {
    return `${c.intent ?? 'step'} → ${c.resumeDirection ?? '?'} @ (${c.resumeX ?? '?'},${c.resumeY ?? '?'}) ${c.satisfied ? '(done)' : ''}`;
  }
}
