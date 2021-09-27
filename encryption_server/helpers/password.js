const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error(`Error occurred during password hashing: ${error.message}`);
  }
  return null;
};

const checkPassword = async (password, hash) => {
  try {
    const isCorrect = await bcrypt.compare(password, hash);
    return isCorrect;
  } catch (error) {
    console.error(`Error occurred during password checking: ${error.message}`);
  }
  return false;
};

module.exports = {
  hashPassword,
  checkPassword,
};
