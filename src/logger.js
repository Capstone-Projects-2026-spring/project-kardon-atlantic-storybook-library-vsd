// This file handles logging for the VSD Storybook app.
// "Logging" just means recording what's happening so developers can debug.
// Every important user action gets logged with a timestamp.

const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

function log(level, message, data = null) {
  const timestamp = new Date().toISOString(); 
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

// specific logging functions from the documentation:

export function logLogin(userId) {
  log(LOG_LEVELS.INFO, `User logged in`, { userId });
}

export function logBookUpload(fileName) {
  log(LOG_LEVELS.INFO, `User uploaded a book: ${fileName}`);
}

export function logPageView(pageNumber) {
  log(LOG_LEVELS.INFO, `User viewed page ${pageNumber}`);
}

export function logPageFlip(direction) {
  log(LOG_LEVELS.INFO, `User flipped page: ${direction}`);
}

export function logHotspotClick(word) {
  log(LOG_LEVELS.INFO, `User clicked hotspot: "${word}"`);
}

export function logBookSelection(bookTitle) {
  log(LOG_LEVELS.INFO, `User selected book: "${bookTitle}"`);
}

export function logError(message, error) {
  log(LOG_LEVELS.ERROR, message, error);
}