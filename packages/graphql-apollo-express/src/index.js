import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;

const users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

const me = users[1];

const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  // eslint-disable-next-line no-console
  console.log('Apollo Server on http://localhost:8000/graphql');
});
