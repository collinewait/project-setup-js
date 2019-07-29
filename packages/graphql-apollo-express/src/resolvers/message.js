import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (_parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};

      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
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

        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message: createdMessage },
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
    user: async (message, _args, { loaders }) => {
      const messageOwner = await loaders.user.load(message.userId);
      return messageOwner;
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};
