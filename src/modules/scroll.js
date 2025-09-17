/**
 * Changes the scroll behavior.
 * @param {HTMLElement} node - The target element.
 * @param {number} speed - The scroll speed.
 * @param {number} smooth - The smoothness of the scroll.
 */

export const addSmoothScroll = (node, speed = 40, smooth = 12) => {
    let moving = false,
        position = node.scrollTop;
    const frame = node === document.body ? document.documentElement : node;
    // Update position
    const update = () => {
        moving = true;
        const delta = (position - node.scrollTop) / smooth;
        node.scrollTop += delta;
        Math.abs(delta) > 0.1 ? requestAnimationFrame(update) : moving = false;
    };
    // Scrolled
    const updatePosition = (delta) => {
        position = Math.max(0, Math.min(position + delta, node.scrollHeight - frame.clientHeight + 10));
        if (!moving) update();
    };
    // Listeners
    node.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.wheelDelta ? e.wheelDelta / 120 : -e.deltaY / (e.deltaMode === 1 ? 3 : 120);
        updatePosition(-delta * speed);
    }, {
        passive: false
    });
    let touchY;
    node.addEventListener('touchstart', e => touchY = e.touches[0].clientY, {
        passive: true
    });
    node.addEventListener('touchmove', e => {
        e.preventDefault();
        const delta = touchY - e.touches[0].clientY;
        touchY = e.touches[0].clientY;
        updatePosition(delta);
    }, {
        passive: false
    });
};