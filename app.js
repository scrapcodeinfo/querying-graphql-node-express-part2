const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const app = express();
const PORT = 3000;

let countId = 0;
const PERSONS = [{
  id: ++countId,
  firstName: 'Shanmugavel',
  lastName: 'S',
  contact: {
    phone: [888888, 777878],
    email: 'shan@scrapcode.info',
  }
}, {
  id: ++countId,
  firstName: 'Deva',
  lastName: 'D',
  contact: {
    phone: [3434342, 6767645],
    email: 'deva@maildomain.com',
  }
}];

const typeDefs = `
  type Contact {
    phone: [Int]
    email: String
  }
  type Person {
    id: Int
    firstName: String
    lastName: String
    contact: Contact
    fullName: String
  }
  type Query {
    findAll: [Person]
    find(id: Int): Person
  }
`;

const resolvers = {
  Query: {
    findAll: () => PERSONS,
    find: (obj, args) => {
      const person = PERSONS.filter(val => val.id === args.id);
      return person[0];
    },
  },
  Person: {
    fullName: (obj, args) => `${obj.firstName} ${obj.lastName}` 
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.get('/', (req, res) => {
  res.send(`<a href='graphiql'>Click here</a> to access GraphiQL`);
});

app.use('/graphiql', graphqlHTTP({
  schema,
  graphiql: true,
  pretty: true,
}));

app.listen(PORT, () => console.log(`GraphQL server is running on port ${PORT} ...`));
