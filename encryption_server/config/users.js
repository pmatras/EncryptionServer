const { hashPassword } = require('../helpers/password');

const getMockedUsers = async () => [
  {
    name: 'John Doe',
    username: 'john',
    email: 'john@example.com',
    password: await hashPassword('john123'),
  },
  {
    name: 'Jane Doe',
    username: 'jane',
    email: 'jane@example.com',
    password: await hashPassword('jane123'),
  },
];

module.exports = getMockedUsers;
