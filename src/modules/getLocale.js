// Imports
import translations from "../locale/translations.json"
assert { type: "json" };

/**
 * Retrieves the game language.
 * @returns {string} The language code.
 */

export const getLocale = () => {
	const lang = localStorage?.getItem("language_store_key")?.toLowerCase() || navigator.language.split("-")?.[0];
	return Object.keys(translations).includes(lang) ? lang : "en";
};