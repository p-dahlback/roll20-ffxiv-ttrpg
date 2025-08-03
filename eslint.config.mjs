import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  {
    "ignorePatterns": [".build/**.js", "Mods/**.js"],

    // Define globals for browser environments
    languageOptions: {
      globals: {
        "WeakMap": true,
        "Set": true,
        "setAttrs": true,
        "setInterval": true,
        "clearInterval": true,
        "clearTimeout": true,
        "setTimeout": true,
        "playerIsGM": true,
        "getObj": true,
        "findObjs": true,
        "filterObjs": true,
        "createObj": true,
        "sendChat": true,
        "log": true,
        "toFront": true,
        "toBack": true,
        "randomInteger": true,
        "setDefaultTokenForCharacter": true,
        "spawnFx": true,
        "spawnFxBetweenPoints": true,
        "spawnFxWithDefinition": true,
        "playJukeboxPlaylist": true,
        "stopJukeboxPlaylist": true,
        "sendPing": true,
        "state": true,
        "globalconfig": true,
        "_": true,
        "Campaign": true,
        "getAllObjs": true,
        "getAttrByName": true,
        "onSheetWorkerCompleted": true,
        "on": true,
        "Promise": true,
        "Uint32Array": true,
        "takeCardFromPlayer": true,
        "giveCardToPlayer": true,
        "recallCards": true,
        "shuffleDeck": true,
        "drawCard": true,
        "cardInfo": true,
        "playCardToTable": true,

        "getAttrs": true,
        "getSectionIDs": true,
        "generateRowID": true,
        "removeRepeatingRow": true,
        "startRoll": true,
        "finishRoll": true
      }
    },
    rules: {
      "no-console": "warn",
      "linebreak-style": [
        "error",
        "unix"
      ],
      "semi": [
        "error",
        "always"
      ],
      "comma-dangle": [
        "error",
        "never"
      ]
    }
  }
]);
