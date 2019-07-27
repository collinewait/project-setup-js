import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  const token = await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
  return token;
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      const users = await models.User.findAll();
      return users;
    },
    user: async (parent, { id }, { models }) => {
      const user = await models.User.findByPk(id);
      return user;
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      const myself = await models.User.findByPk(me.id);
      return myself;
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '1000m') };
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      const userMessages = await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
      return userMessages;
    },
  },
};