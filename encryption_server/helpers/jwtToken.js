const Jwt = require('@hapi/jwt');

const {
  jwt: { key, algorithm, expirationSecs },
} = require('../config/config');

const createToken = ({ email }) => {
  try {
    const token = Jwt.token.generate(
      {
        email,
      },
      {
        key,
        algorithm,
      },
      {
        ttlSec: expirationSecs,
      }
    );
    console.log(
      `Created new JWT token for user associated with email: ${email}, valid for ${expirationSecs}s`
    );
    return token;
  } catch (error) {
    console.error(
      `Error occurred during JWT token generation: ${error.message}`
    );
    throw error;
  }
};

module.exports = createToken;
