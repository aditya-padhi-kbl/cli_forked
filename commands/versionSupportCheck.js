import { createRequire } from "module";
import fetch from "sync-fetch";
import Logger from "../utils/logger.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const SUPPORTED_ENDPOINT = "https://raw.githubusercontent.com/reactioncommerce/cli/trunk/supported.json";
/**
 * @summary checks for supported version
 * @returns {boolean} - return true if successful
 */
export default function versionSupportCheck() {
  try {
    const response = fetch(SUPPORTED_ENDPOINT);
    const supported = response.json();
    const currentVersion = pkg.version;

    // Check for any messages for this version
    const messages = supported?.messages?.[currentVersion] ?? [];
    for (const msg of messages) {
      Logger.info(msg);
    }

    // Check for unsupported versions
    if (supported?.unsupportedVersions?.indexOf(currentVersion) > -1) {
      // The current version is not supported. Exit!
      Logger.error("This version is no longer supported. Please update reaction cli using\n\t npm update -g @reactioncommerce/cli");
      process.exit(); // eslint-disable-line no-process-exit
    }
  } catch (err) {
    // Swallowing the error if we can't fetch supported versions
    Logger.debug("Error fetching/parsing supported.json");
    Logger.debug(err);
    return false;
  }
  return true;
}
