const Loki = require('lokijs');
const getMockedUsers = require('../config/users');

const DB_NAME = 'encryption_server';
const {
  db: { usersCollection },
} = require('../config/config');

const db = new Loki(DB_NAME);

(async () => {
  const mockedUsers = db
    .addCollection(usersCollection, { unique: 'email' })
    .insert(await getMockedUsers());
  console.log(
    `Database populated with users: ${JSON.stringify(mockedUsers, null, 2)}`
  );
})();

module.exports = db;
