// Imports
import { addContextMenuItem } from './modules/addContextMenuItem.js';
import globalStyle from './scss/main.scss';

(async () => {
    // Prevent wrong injection
    if (!location.href.includes("tankionline.com/play/") || window.__trackit) return;
    window.__trackit = true;

    // Append styles
    const style = document.createElement("style");
    style.innerHTML = globalStyle;
    document.body.append(style);

    // ContextMenu observer
    const contextObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const contextMenu = node.querySelector(".ContextMenuStyle-menu");
                        if (contextMenu) {
                            addContextMenuItem(contextMenu);
                            // Hide the menu to avoid Tanki's default behavior, which displays the wrong menu when the friend list is updated
                            const currentPlayer = contextMenu.querySelector(".ContextMenuStyle-menuItem span").textContent;
                            const menuObserver = new MutationObserver(mutations => {
                                mutations.forEach(mutation => {
                                    if (document.querySelector(".ContextMenuStyle-menu")) {
                                        if (mutation.type === "childList") {
                                            if (["ContextMenuStyle-menu", "ContextMenuStyle-menuItem"].some(className => mutation.target.classList.contains(className)) && mutation.target.querySelector("span")?.textContent !== currentPlayer) {
                                                // Hide the menu as soon as possible
                                                contextMenu.style.display = "none";
                                                // Dispatch mouse event to close it
                                                document.body.dispatchEvent(new MouseEvent("mouseup", {
                                                    bubbles: true
                                                }));
                                            }
                                        }
                                    } else {
                                        menuObserver.disconnect();
                                    }
                                });
                            });
                            menuObserver.observe(contextMenu, {
                                childList: true,
                                subtree: true
                            });
                        }
                    }
                });
            }
        });
    });
    contextObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();