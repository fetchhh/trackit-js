import JSConfuser from "js-confuser";
import path from 'path';
import { readFileSync, writeFileSync } from "fs";

// Read input code
const sourceCode = readFileSync(path.resolve(import.meta.dirname, '../dist/bundle.js'), 'utf8');

// Preset
const options = {
  target: "browser",
  preset: "low",
};

console.log(`Obfuscating...`);
JSConfuser.obfuscate(sourceCode, options)
  .then((result) => {
    // Write output code
    console.log(`Successfully obfuscated with ${ options.preset} preset!`);
    writeFileSync(path.resolve(import.meta.dirname, '../dist/obfuscated/output.js'), result.code);
  })
  .catch((err) => {
    // Error occurred
    console.error(err);
  });