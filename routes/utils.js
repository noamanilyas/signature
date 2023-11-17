const crypto = require("crypto");

function encrypt(text) {
  const securityKey = "SXE3RbD4W84CcMgt";
  var alg = "des-ede-cbc";
  var key = new Buffer.from(securityKey, "utf-8");
  var iv = new Buffer.from("QUJDREVGR0g=", "base64");
  var cipher = crypto.createCipheriv(alg, key, iv);
  var encoded = cipher.update(text, "ascii", "base64");
  encoded += cipher.final("base64");
  return encoded;
}

function decrypt(encryptedText) {
  const securityKey = "SXE3RbD4W84CcMgt";
  var alg = "des-ede-cbc";
  var key = Buffer.from(securityKey, "utf-8");
  var iv = Buffer.from("QUJDREVGR0g=", "base64");
  var encrypted = Buffer.from(encryptedText, "base64");
  var decipher = crypto.createDecipheriv(alg, key, iv);
  var decoded = decipher.update(encrypted, "binary", "ascii");
  decoded += decipher.final("ascii");
  return decoded;
}

function encryptFile(data) {
  const algorithm = "aes-256-cbc";
  const key = "9f32d568b7be6c25698741d6e7c256f7";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
  return Buffer.concat([iv, encryptedData]);
}

function decryptFile(encryptedData) {
  const algorithm = "aes-256-cbc";
  const key = "9f32d568b7be6c25698741d6e7c256f7";
  const iv = encryptedData.slice(0, 16);
  const data = encryptedData.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  const decryptedData = Buffer.concat([decipher.update(data), decipher.final()]);
  return decryptedData;
}

module.exports = { decrypt, encrypt, encryptFile, decryptFile };
