// Small helpers that clean user input before it is used or stored.

function cleanName(name) {
  if (typeof name !== "string") return "";
  // remove control characters, trim spaces, keep at most 20 characters
  return name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 20);
}

function cleanMessage(text) {
  if (typeof text !== "string") return "";
  return text.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 500);
}

module.exports = { cleanName, cleanMessage };
