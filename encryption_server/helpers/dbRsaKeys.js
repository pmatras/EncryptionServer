const db = require('../database/db');

const {
  db: { rsaKeysCollection },
} = require('../config/config');

const getRsaKeysPairForUser = ({ id: userId }) => {
  if (!userId && userId !== 0) {
    console.error('Id must be passed in order to obtain RSA keys pair from db');
    return null;
  }
  return db
    .getCollection(rsaKeysCollection)
    .findOne({ userId: { $eq: userId } });
};

const addRsaKeysPairForUser = ({ id: userId }, keys) => {
  const inserted = db
    .getCollection(rsaKeysCollection)
    .insertOne({ userId, keys });
  console.log(`Inserted RSA keys pair: ${JSON.stringify(inserted, null, 2)}`);
};

module.exports = {
  getRsaKeysPairForUser,
  addRsaKeysPairForUser,
};
