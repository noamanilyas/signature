const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const DEFAULT_FILE = path.join(DATA_DIR, "mock-db.json");

function getFilePath() {
  const customPath = process.env.MOCK_DB_PATH;
  return customPath ? path.resolve(customPath) : DEFAULT_FILE;
}

function load() {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(data) {
  const filePath = getFilePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { load, save, getFilePath };
