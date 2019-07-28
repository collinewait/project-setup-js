import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  const token = await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
  return token;
};

export default {
  Query: {
    users: async (_parent, _args, { models }) => {
      const users = await models.User.findAll();
      return users;
    },
    user: async (_parent, { id }, { models }) => {
      const user = await models.User.findByPk(id);
      return user;
    },
    me: async (_parent, _args, { models, me }) => {
      if (!me) {
        return null;
      }
      const myself = await models.User.findByPk(me.id);
      return myself;
    },
  },

  Mutation: {
    signUp: async (
      _parent,
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
    signIn: async (_parent, { login, password }, { models, secret }) => {
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

    deleteUser: combineResolvers(
      isAdmin,
      async (_parent, { id }, { models }) => {
        const userDeletionStatus = await models.User.destroy({
          where: { id },
        });
        return userDeletionStatus;
      },
    ),
  },

  User: {
    messages: async (user, _args, { models }) => {
      const userMessages = await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
      return userMessages;
    },
  },
};
