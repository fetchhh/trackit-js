// Imports
import { addSmoothScroll } from './scroll.js';
import { findPlayer } from './findPlayer.js';
import { getLocale } from './getLocale.js';
import translations from "../locale/translations.json"
assert { type: "json" };

// Locale
const locale = getLocale();

/**
 * Adds items to the context menu.
 * @param {HTMLElement} parent - The context menu element.
 */

export const addContextMenuItem = async (parent) => {
    try {
        // Prevent adding friend while the nicknames container is growing
        let originalAdd, addRow; 
        const rows = parent.querySelectorAll(".Common-flexStartAlignCenter");
        rows.forEach(row => {
            if (translations[locale].addFriend === row.textContent) {
                // Store row and its function
                addRow = row;
                originalAdd = row.onclick;
                // Stop propagation
                row.onclick = (event) => {
                    event.stopPropagation();
                };
            }
        });

        const firstRow = parent.children[0];
        const secondRow = parent.children[1];
        const rowClassName = secondRow.className;
        // Nicknames container
        secondRow.insertAdjacentHTML("beforebegin", `
                <div class="${rowClassName} row-content">
                  <span class="row-indicator"></span>
                  <div class="loader">
                    <svg width="1.3em" height="1.3em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="7" stroke="white" stroke-opacity="0.1" stroke-width="4" />
                      <path d="M3.50534 13.3369C2.72777 12.3518 2.22936 11.1757 2.0623 9.9318C1.89523 8.68793 2.06566 7.42202 2.55573 6.26661C3.04581 5.11121 3.8375 4.10881 4.84792 3.36438C5.85834 2.61994 7.05033 2.16085 8.29906 2.03518" stroke="url(#paint0_linear_416_484)" stroke-width="4" />
                      <defs>
                        <linearGradient id="paint0_linear_416_484" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#76FF33" />
                          <stop offset="1" stop-color="#76FF33" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
            `);
        // Subscribe button
        secondRow.insertAdjacentHTML("beforebegin", `
                        <div class="${rowClassName} row-content subscribe">
                            <span class="subscribe-text">
                                <a>${translations[locale].subscribe}</a>
                            </span>
                            <div class="subscribe-indicator">
                                <svg width="0.75em" height="0.75em" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.999999 6.94964L6.94964 1M6.94964 1L1 1M6.94964 1L6.94964 6.94964" stroke="#FFBB00" stroke-width="1.5"/>
                                </svg>
                            </div>
                        </div>
                    `);

        const subscribeButton = document.querySelector(".subscribe");
        subscribeButton.addEventListener("click", () => {
            if (navigator.userAgent.includes("Electron")) {
                window.open("https://boosty.to/idkwhat", "", `height=${window.innerHeight / 1.3},width=${window.innerWidth / 1.5}`);
            } else {
                window.open("https://boosty.to/idkwhat", "_blank");
            }
        });

        const player = parent.querySelector(".ContextMenuStyle-menuItem .Common-whiteSpaceNoWrap").textContent.replace(/\s*\[.*?\]\s*/g, '');
        const response = await findPlayer(player);
        const nicknames = response.nicknames;
        const status = response.status;

        const contextMenu = parent;
        const rowContent = document.querySelector(".row-content");
        const rowIndicator = document.querySelector(".row-indicator");
        const loader = document.querySelector(".loader");

        // Prevent appending wrong content if the menu has changed too early
        if (document.querySelector(".ContextMenuStyle-menu span").textContent !== parent.querySelector("span").textContent) return;

        // Crown indicator
        const crownIndicator = document.createElement("div");
        crownIndicator.className = "crown-indicator";
        crownIndicator.innerHTML = `
            <svg width="0.9em" height="0.9em" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.714286 6.92308L0 0L2.85714 4.84615L5 0L7.14286 4.84615L10 0L9.28571 6.92308H0.714286Z" fill="#FFBB00"/>
                <path d="M9.28571 7.61539H0.714286V9H9.28571V7.61539Z" fill="#FFBB00"/>
            </svg>
            `;
        firstRow.appendChild(crownIndicator);

        // Special crown for developers
        const developers = ["lmaohelpme"];
        if (developers.includes(player)) {
            crownIndicator.style.display = "flex";
            document.querySelectorAll(".crown-indicator svg path").forEach(path => {
                path.style.fill = "#FF0033";
            })
        }

        if (status == 200 || status == 201 || status == 404) {
            if (nicknames) {
                if (nicknames.length > 0) {
                    if (nicknames.length > 1) {
                        if (nicknames[0] == player) {
                            nicknames.shift();
                        }
                        // Found 
                        loader.style.display = "none";
                        rowIndicator.style.display = "flex";
                        const nicknamesContainer = document.createElement("div");
                        const rowOverlay = document.createElement("div");
                        const overlay = document.createElement("span");
                        nicknamesContainer.className = "nicknames-container";
                        rowOverlay.className = "row-overlay";
                        overlay.className = "overlay";
                        rowOverlay.appendChild(overlay);
                        rowContent.append(nicknamesContainer, rowOverlay);
                        rowContent.classList.add("found");
                        rowIndicator.innerText = `${translations[locale].found} ${nicknames.length}`;

                        // Append nicks
                        nicknames.forEach(nick => {
                            const div = document.createElement("div");
                            div.className = "nickname";
                            div.innerText = nick;
                            nicknamesContainer.appendChild(div);
                        })

                        // Handle scrollbar
                        addSmoothScroll(nicknamesContainer);
                        nicknamesContainer.addEventListener("mouseenter", () => {
                            setTimeout(() => {
                                if (nicknamesContainer.matches(":hover")) {
                                    nicknamesContainer.style.overflowY = "auto";
                                }
                            }, 300);
                        });
                        nicknamesContainer.addEventListener("mouseleave", () => {
                            nicknamesContainer.style.overflowY = 'hidden';
                        });

                        // Animate height of the nicknames container
                        rowContent.style.maxHeight = "5.1em";

                        // Copy nickname
                        nicknamesContainer.querySelectorAll("div").forEach(node => {
                            node.addEventListener("click", () => {
                                navigator.clipboard.writeText(node.textContent);
                            });
                        });
                    } else {
                        // No changes
                        loader.style.display = "none";
                        rowIndicator.style.display = "flex";
                        rowIndicator.innerText = translations[locale].noChanges;
                    }
                } else {
                    // Not found
                    loader.style.display = "none";
                    rowIndicator.style.display = "flex";
                    rowIndicator.innerText = translations[locale].notFound;
                }
            } else {
                // Hidden
                loader.style.display = "none";
                crownIndicator.style.display = "flex";
                rowIndicator.style.display = "flex";
                const hiddenIndicator = document.createElement("div");
                hiddenIndicator.className = "hidden-indicator";
                hiddenIndicator.innerHTML = ` 
                    <svg width="0.7em" height="0.7em" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_857_115)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.68948 1.83353C1.68948 1.46264 1.84134 1.20382 2.06246 1.02978C2.2931 0.848263 2.61701 0.74691 2.95781 0.746913C3.29861 0.746915 3.62251 0.848274 3.85315 1.02979C4.07429 1.20383 4.22615 1.46267 4.22615 1.83353V3.12531H1.68948V1.83353ZM0.939469 3.12531V1.83353C0.939469 1.23437 1.19844 0.765679 1.59356 0.454706C1.97918 0.151213 2.47694 0.010067 2.95781 0.0100708C3.43869 0.0100747 3.93645 0.151229 4.32206 0.454722C4.71719 0.765695 4.97615 1.23438 4.97615 1.83353V3.12531H5.91604V7.00014H0V3.12531H0.939469Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_857_115">
                                <rect width="6" height="7" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    `;
                rowContent.insertBefore(hiddenIndicator, rowIndicator);
                rowContent.classList.add("hidden");
                rowIndicator.classList.add("hidden");
                rowIndicator.innerText = translations[locale].hidden;
            }
        } else {
            // Error
            loader.style.display = "none";
            rowIndicator.style.display = "flex";
            rowIndicator.innerText = translations[locale].error;
        }
        // Restore addFriend button
        if (addRow && originalAdd) addRow.onclick = originalAdd;
        // Fix menu position if it overflows 
        const contextMenuRect = contextMenu.getBoundingClientRect();
        if (contextMenuRect.bottom > window.innerHeight) {
            contextMenu.parentElement.style.top = null;
            contextMenu.parentElement.style.bottom = 0;
        }
    } catch {
        console.error("Failed to add context menu item");
    }
};