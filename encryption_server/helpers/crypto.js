const { generateKeyPairSync } = require('crypto');

const {
  rsaKeys: { keysLength, privateKeyPassword },
} = require('../config/config');

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

module.exports = {
  generateKeyPair,
};
