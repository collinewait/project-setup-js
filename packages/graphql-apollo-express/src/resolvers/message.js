import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (_parent, { offset = 0, limit = 100 }, { models }) => {
      const messages = await models.Message.findAll({
        offset,
        limit,
      });
      return messages;
    },
    message: async (_parent, { id }, { models }) => {
      const message = await models.Message.findByPk(id);
      return message;
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (_parent, { text }, { me, models }) => {
        const createdMessage = await models.Message.create({
          text,
          userId: me.id,
        });
        return createdMessage;
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (_parent, { id }, { models }) => {
        const deletionResponse = await models.Message.destroy({
          where: { id },
        });
        return deletionResponse;
      },
    ),
  },

  Message: {
    user: async (message, _args, { models }) => {
      const messageOwner = await models.User.findByPk(message.userId);
      return messageOwner;
    },
  },
};
