const db = require('../database/db');
const {
  db: { usersCollection },
} = require('../config/config');

const getUserByEmail = (email) => {
  if (!email) {
    console.error('Email must be passed in order to obtain user from db');
    return null;
  }
  return db.getCollection(usersCollection).findOne({ email: { $eq: email } });
};

module.exports = {
  getUserByEmail,
};
