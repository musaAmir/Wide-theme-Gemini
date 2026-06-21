const STORAGE_KEY = 'geminiWidth';
const DEFAULT_WIDTH = Math.min(Math.floor(window.innerWidth * 0.8), 1200);

let geminiWidth = Number(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WIDTH;
let rafId = null;
let mutationTimeout = null;

const getBounds = () => {
  const min = Math.max(400, Math.floor(window.innerWidth * 0.4));
  const max = Math.max(min, Math.floor(window.innerWidth * 0.95));
  return { min, max };
};

const clampWidth = (value) => {
  const { min, max } = getBounds();
  return Math.min(Math.max(value, min), max);
};

geminiWidth = clampWidth(geminiWidth);

const saveWidth = (value) => {
  localStorage.setItem(STORAGE_KEY, String(value));
};

const applyStyles = () => {
  const widthPx = `${geminiWidth}px`;
  // Base class names only — Angular's `.ng-star-inserted` helper is added and
  // removed dynamically, so depending on it makes the selectors brittle.
  const groups = [
    '.conversation-container',
    '.input-area-container',
    '.bottom-container'
  ];

  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.width = widthPx;
      el.style.maxWidth = '100%';
      el.style.minWidth = '15%';
    });
  });
};

const scheduleApply = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = null;
    applyStyles();
  });
};

(function initUI() {
  const { min, max } = getBounds();

  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .gwide-wrapper {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 1000;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #dce0e6;
    }
    .gwide-toggle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(16, 17, 19, 0.9);
      color: #4a4f57;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
      padding: 0;
    }
    .gwide-toggle svg {
      width: 18px;
      height: 18px;
    }
    .gwide-panel {
      margin-top: 8px;
      padding: 10px 12px;
      width: 240px;
      background: rgba(18, 19, 21, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
    }
    .gwide-panel.hidden {
      display: none;
    }
    .gwide-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 6px;
      color: #9aa0a6;
    }
    .gwide-row strong {
      color: #dce0e6;
      font-weight: 600;
    }
    .gwide-slider {
      width: 100%;
      accent-color: #6f7a86;
    }
    .gwide-reset {
      margin-top: 8px;
      font-size: 11px;
      color: #6f7a86;
      cursor: pointer;
      text-decoration: underline;
      background: none;
      border: none;
      padding: 0;
    }
  `;
  document.head.appendChild(styleElement);

  const wrapper = document.createElement('div');
  wrapper.className = 'gwide-wrapper';
  wrapper.innerHTML = `
    <button class="gwide-toggle" title="Adjust Gemini width" aria-label="Adjust Gemini width">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12h16"/>
        <path d="M12 4v16"/>
      </svg>
    </button>
    <div class="gwide-panel hidden">
      <div class="gwide-row">
        <span>Width</span>
        <strong id="gwide-value">${geminiWidth}px</strong>
      </div>
      <input
        type="range"
        class="gwide-slider"
        min="${min}"
        max="${max}"
        value="${geminiWidth}"
        aria-label="Gemini width"
      />
      <button class="gwide-reset" type="button">Reset to default</button>
    </div>
  `;

  document.body.appendChild(wrapper);

  const valueEl = wrapper.querySelector('#gwide-value');
  const slider = wrapper.querySelector('.gwide-slider');
  const panel = wrapper.querySelector('.gwide-panel');
  const toggleBtn = wrapper.querySelector('.gwide-toggle');
  const resetBtn = wrapper.querySelector('.gwide-reset');

  const updateValueDisplay = () => {
    if (valueEl) valueEl.textContent = `${geminiWidth}px`;
  };

  const updateSliderBounds = () => {
    const { min: newMin, max: newMax } = getBounds();
    slider.min = newMin;
    slider.max = newMax;
    if (geminiWidth > newMax || geminiWidth < newMin) {
      geminiWidth = clampWidth(geminiWidth);
      slider.value = geminiWidth;
      updateValueDisplay();
      saveWidth(geminiWidth);
      scheduleApply();
    }
  };

  slider.addEventListener('input', (event) => {
    const nextWidth = clampWidth(Number(event.target.value));
    geminiWidth = nextWidth;
    saveWidth(geminiWidth);
    updateValueDisplay();
    scheduleApply();
  });

  resetBtn.addEventListener('click', () => {
    geminiWidth = clampWidth(DEFAULT_WIDTH);
    slider.value = geminiWidth;
    saveWidth(geminiWidth);
    updateValueDisplay();
    scheduleApply();
  });

  toggleBtn.addEventListener('click', () => {
    if (!panel) return;
    panel.classList.toggle('hidden');
  });

  window.addEventListener('resize', () => {
    updateSliderBounds();
  });
})();

function changeElementsSize() {
  scheduleApply();
}

const observer = new MutationObserver(() => {
  clearTimeout(mutationTimeout);
  mutationTimeout = setTimeout(scheduleApply, 150);
});

observer.observe(document.body, { childList: true, subtree: true });

setTimeout(scheduleApply, 800);
