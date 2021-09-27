const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const Boom = require('@hapi/boom');
const addRoutes = require('../routes/routes');
const { getUserByEmail } = require('../helpers/dbUsers');

const {
  server: { port, host },
  jwt: { key, algorithm, expirationSecs },
} = require('../config/config');

const server = Hapi.server({
  port,
  host,
});

const initServer = async () => {
  await server.register(Jwt);

  server.auth.strategy('jwt_auth', 'jwt', {
    keys: {
      key,
      algorithms: [algorithm],
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: false,
      exp: true,
      maxAgeSec: expirationSecs,
    },
    httpAuthScheme: 'Bearer',
    validate: (artifacts, req, h) => {
      const {
        decoded: {
          payload: { email },
        },
      } = artifacts;
      const { method, path } = req;
      const user = getUserByEmail(email);
      if (!user) {
        console.log(
          `Token not associated with any existent user - request ${method} ${path}, passed token was generated for user with email ${email} which doesn't exist`
        );
        throw Boom.unauthorized('Token not associated with valid user');
      }

      return {
        isValid: true,
        credentials: user,
      };
    },
  });

  addRoutes(server);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  process.on('unhandledRejection', (error) => {
    console.error(error);
    process.exit(1);
  });
};

initServer();
