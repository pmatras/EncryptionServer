const {
  generateKeyPairSync,
  publicEncrypt,
  randomBytes,
  createCipheriv,
} = require('crypto');

const path = require('path');
const { readFileSync } = require('fs');

const {
  rsaKeys: { keysLength, privateKeyPassword },
} = require('../config/config');

const PDF_FILE_PATH = path.join(__dirname, '..', 'assets', 'sample.pdf');

const AES_ALGORITHM = 'aes-256-ctr';
const AES_KEY_LENGTH = 32;
const AES_IV_LENGTH = 16;

const generateKeyPair = async () => {
  try {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: keysLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: privateKeyPassword,
      },
    });
    console.log(
      `Successfully generated new RSA keys pair with length of ${keysLength} bits`
    );
    return { publicKey, privateKey, privateKeyPassword };
  } catch (error) {
    console.error(`Failed to generate new RSA keys pair - ${error.message}`);
    throw error;
  }
};

const encryptSymmetric = (data) => {
  const key = randomBytes(AES_KEY_LENGTH);
  const iv = randomBytes(AES_IV_LENGTH);
  const aesCipher = createCipheriv(AES_ALGORITHM, key, iv);
  const encryptedData = aesCipher.update(data);
  aesCipher.final();
  return { key, iv, encryptedData };
};

const encryptAssymmetric = (rsaKey, data) => publicEncrypt(rsaKey, data);

const encryptSampleFile = async (rsaKey) => {
  try {
    const data = readFileSync(PDF_FILE_PATH, { encoding: 'utf-8' });
    const { encryptedData, key, iv } = encryptSymmetric(data);
    const encryptedKey = encryptAssymmetric(rsaKey, key);
    console.log('Successfully encrypted sample pdf file');
    return {
      fileBase64: encryptedData.toString('base64'),
      keyBase64: encryptedKey.toString('base64'),
      ivHex: iv.toString('hex'),
    };
  } catch (error) {
    console.error(
      `Error occurred during sample pdf file encryption: ${e.message}`
    );
    throw error;
  }
};

module.exports = {
  generateKeyPair,
  encryptSampleFile,
};
