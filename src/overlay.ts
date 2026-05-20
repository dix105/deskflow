import { listen } from '@tauri-apps/api/event';
import './overlay.css';

type OverlayState = 'ready' | 'listening' | 'processing' | 'polishing' | 'inserted';

const overlay = document.querySelector<HTMLElement>('#overlay')!;
const dots = Array.from(document.querySelectorAll<HTMLElement>('.overlay span'));

const dotMultipliers = [0.55, 0.95, 1.35, 0.95, 0.55];
let listening = false;
let lastLevelAt = 0;
let fallbackFrame = 0;

function setOverlayState(state: OverlayState) {
  listening = state === 'listening';
  overlay.className = `overlay ${state}`;
  if (state !== 'listening') setLevel(state === 'inserted' ? 0.55 : 0.08);
}

function setLevel(rawLevel: number) {
  const level = Math.max(0, Math.min(1, rawLevel));
  dots.forEach((dot, index) => {
    const height = 5 + level * 20 * dotMultipliers[index % dotMultipliers.length];
    dot.style.setProperty('--dot-height', `${Math.max(5, Math.min(25, height))}px`);
    dot.style.setProperty('--dot-opacity', String(0.48 + level * 0.52));
  });
}

function fallbackWave() {
  if (listening && Date.now() - lastLevelAt > 260) {
    const t = Date.now() / 160;
    dots.forEach((dot, index) => {
      const wave = (Math.sin(t + index * 0.8) + 1) / 2;
      dot.style.setProperty('--dot-height', `${5 + wave * 15}px`);
      dot.style.setProperty('--dot-opacity', String(0.48 + wave * 0.46));
    });
  }
  fallbackFrame = window.requestAnimationFrame(fallbackWave);
}

listen<OverlayState>('dictation-overlay-state', (event) => {
  setOverlayState(event.payload || 'ready');
});

listen<number>('dictation-overlay-level', (event) => {
  if (!listening) return;
  lastLevelAt = Date.now();
  setLevel(event.payload || 0);
});

setOverlayState('ready');
fallbackWave();
window.addEventListener('beforeunload', () => cancelAnimationFrame(fallbackFrame));
