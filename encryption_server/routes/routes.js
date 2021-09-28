const Joi = require('joi');
const Boom = require('@hapi/boom');

const { getUserByEmail } = require('../helpers/dbUsers');

const createToken = require('../helpers/jwtToken');

const { checkPassword } = require('../helpers/password');

const { generateKeyPair, encryptSampleFile } = require('../helpers/crypto');

const {
  addRsaKeysPairForUser,
  getRsaKeysPairForUser,
} = require('../helpers/dbRsaKeys');

const addRoutes = (server) => {
  const routes = [
    {
      method: 'POST',
      path: '/api/sign-in',
      config: {
        pre: [
          {
            method: async (req, h) => {
              const { password, email } = req.payload;
              const user = getUserByEmail(email);
              if (!user) {
                throw Boom.badRequest('Wrong username or password');
              }
              if (await checkPassword(password, user.password)) {
                return h.response(user);
              }

              return Boom.badRequest('Wrong password');
            },
            assign: 'user',
          },
        ],
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().alphanum().min(2).max(255).required(),
          }).required(),
        },
        handler: (req, h) => {
          try {
            const { user } = req.pre;
            console.log(`User ${user.name} is signing in...`);
            const authToken = createToken(user);
            return h.response({ authToken }).code(200);
          } catch (error) {
            console.error(
              `Failed to sign in user, error occurred: ${error.message}`
            );
            throw Boom.internal(error.message);
          }
        },
      },
    },
    {
      method: 'POST',
      path: '/api/generate-key-pair',
      config: {
        auth: {
          strategy: 'jwt_auth',
        },
        pre: [
          {
            method: (req, h) => {
              const user = req.auth.credentials;
              const userKeys = getRsaKeysPairForUser(user);
              if (userKeys) {
                throw Boom.badRequest('RSA keys pair already generated');
              }
              return h.continue;
            },
          },
        ],
        handler: async (req, h) => {
          try {
            const user = req.auth.credentials;
            const { publicKey, privateKey, privateKeyPassword } =
              await generateKeyPair();
            addRsaKeysPairForUser(user, {
              publicKey,
              privateKey,
              privateKeyPassword,
            });
            return h
              .response({ privKey: privateKey, pubKey: publicKey })
              .code(201);
          } catch (error) {
            console.error(
              `Error occurred while handling user's RSA keys pair generation request: ${error.message}`
            );
            return Boom.internal(error.message);
          }
        },
      },
    },
    {
      method: 'POST',
      path: '/api/encrypt',
      config: {
        auth: {
          strategy: 'jwt_auth',
        },
        pre: [
          {
            method: (req, h) => {
              const user = req.auth.credentials;
              const userKeys = getRsaKeysPairForUser(user);
              if (!userKeys) {
                throw Boom.badRequest(
                  'RSA keys pair should be generated first'
                );
              }
              return h.response(userKeys);
            },
            assign: 'userKeys',
          },
        ],
        handler: async (req, h) => {
          try {
            const user = req.auth.credentials;
            const {
              userKeys: {
                keys: { publicKey },
              },
            } = req.pre;

            console.log(`Encrypting sample file for user ${user.name}`);
            const result = await encryptSampleFile(publicKey);
            return h.response(result).code(200);
          } catch (error) {
            console.error(
              `Error occurred during handling file encryption using user's rsa public key: ${error.message}`
            );
            return Boom.internal(error.message);
          }
        },
      },
    },
  ];
  server.route(routes);
};

module.exports = addRoutes;
