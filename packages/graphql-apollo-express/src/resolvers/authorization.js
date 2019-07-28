import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (_parent, _args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_parent, _args, { me: { role } }) =>
    role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.'),
);
export const isMessageOwner = async (_parent, { id }, { models, me }) => {
  const message = await models.Message.findByPk(id, { raw: true });

  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};
