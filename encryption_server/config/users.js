const { hashPassword } = require('../helpers/password');

const getMockedUsers = async () => [
  {
    id: 0,
    name: 'John Doe',
    username: 'john',
    email: 'john@example.com',
    password: await hashPassword('john123'),
  },
  {
    id: 1,
    name: 'Jane Doe',
    username: 'jane',
    email: 'jane@example.com',
    password: await hashPassword('jane123'),
  },
];

module.exports = getMockedUsers;
