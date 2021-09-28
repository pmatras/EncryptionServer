const config = {
  db: {
    name: 'encryption_server',
    usersCollection: 'users',
    rsaKeysCollection: 'rsa_keys',
  },
  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
  },
  jwt: {
    key: process.env.JWT_TOKEN_KEY,
    algorithm: 'HS256',
    expirationSecs: 5 * 60,
  },
  rsaKeys: {
    keysLength: 2048,
    privateKeyPassword: process.env.PRIVATE_RSA_KEY_PASSWORD,
  },
};

module.exports = config;
