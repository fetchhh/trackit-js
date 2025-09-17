/**
 * Retrieves a player by name.
 * @param {string} name - The name of the player.
 * @returns {object} The player's data.
 */

export const findPlayer = (name) => {
    // Send the author's request (used for stats only)
    const author = document.querySelector(".UserInfoContainerStyle-userNameRank")?.textContent.replace(/\s*\[.*?\]\s*/g, '');
    return new Promise((resolve, reject) => {
        (GM_xmlhttpRequest || GM.xmlhttpRequest)({
            method: "GET",
            url: `https://trackit-reverse.vercel.app/track/name/${name}${author ? `?id=${author}` : ""}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("spykitBearer")}`
            },
            onload: (response) => {
                const nicknames = [];
                let data;
                if (response.status == 200) {
                    data = JSON.parse(response.response).response[0];
                    if (!data?.hidden) {
                        data.names.forEach((item) => {
                            nicknames.push(item.name);
                        });
                    }
                }
                resolve({
                    nicknames: data?.hidden ? false : nicknames,
                    status: response.status
                });
            },
            onerror: () => {
                reject();
            },
        });
    });
};