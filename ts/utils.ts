export function sync_blink(el: HTMLElement): void { // une fonction pour que tous les éléments jaunes clignotent en même temps
    const now = Date.now();
    const startTime = (window as any)._animationStartTime || ((window as any)._animationStartTime = now);
    const timeOffset = (now - startTime) / 1000 + Math.random() * 0.1;
    el.style.setProperty('--time-offset', timeOffset.toFixed(2));
}