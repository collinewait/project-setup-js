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
      const myself = await models.User.findByPk(me.id);
      return myself;
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
