export default {
  Query: {
    messages: async (parent, args, { models }) => {
      const messages = await models.Message.findAll();
      return messages;
    },
    message: async (parent, { id }, { models }) => {
      const message = await models.Message.findByPk(id);
      return message;
    },
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      const createdMessage = await models.Message.create({
        text,
        userId: me.id,
      });
      return createdMessage;
    },

    deleteMessage: async (parent, { id }, { models }) => {
      const deletionResponse = await models.Message.destroy({
        where: { id },
      });
      return deletionResponse;
    },
  },

  Message: {
    user: async (message, args, { models }) => {
      const messageOwner = await models.User.findByPk(message.userId);
      return messageOwner;
    },
  },
};
