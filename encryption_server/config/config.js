const config = {
  db: {
    name: 'encryption_server',
    usersCollection: 'users',
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
};

module.exports = config;
