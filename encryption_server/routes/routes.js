const Joi = require('joi');
const Boom = require('@hapi/boom');

const { getUserByEmail } = require('../helpers/dbUsers');

const createToken = require('../helpers/jwtToken');

const { checkPassword } = require('../helpers/password');

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
  ];
  server.route(routes);
};

module.exports = addRoutes;
