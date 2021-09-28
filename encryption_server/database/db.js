const Loki = require('lokijs');
const getMockedUsers = require('../config/users');

const {
  db: { name, usersCollection, rsaKeysCollection },
} = require('../config/config');

const db = new Loki(name);

(async () => {
  const mockedUsers = db
    .addCollection(usersCollection, { unique: 'email' })
    .insert(await getMockedUsers());
  console.log(
    `Created users db collection and populated it with users: ${JSON.stringify(
      mockedUsers,
      null,
      2
    )}`
  );

  db.addCollection(rsaKeysCollection, { unique: 'userId' });
  console.log(
    `Created RSA keys db collection for storing users' RSA keys pairs`
  );
})();

module.exports = db;
