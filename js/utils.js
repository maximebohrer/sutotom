export function sync_blink(el) {
    const now = Date.now();
    const startTime = window._animationStartTime || (window._animationStartTime = now);
    const timeOffset = (now - startTime) / 1000 + Math.random() * 0.1;
    el.style.setProperty('--time-offset', timeOffset.toFixed(2));
}
//# sourceMappingURL=utils.js.map