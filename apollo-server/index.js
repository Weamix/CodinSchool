import { ApolloServer } from 'apollo-server-express'

import { MODE_DEVELOPPEMENT, ACTIVER_MOCKS, GRAPHQL_INTROSPECTION } from './composants/config'

import context from './context.js'
import dataSources from './data-sources.js'
import directives from './directives.js'
import mocks from './mocks.js'
import resolvers from './resolvers.js'
import server from './server.js'
import typeDefs from './type-defs.js'
import formatError from './erreurs.js'

export default new ApolloServer({
  subscriptions: false,
  cors: !MODE_DEVELOPPEMENT,
  debug: MODE_DEVELOPPEMENT,

  introspection: GRAPHQL_INTROSPECTION,

  context,
  dataSources,
  schemaDirectives: directives,
  mocks: MODE_DEVELOPPEMENT && ACTIVER_MOCKS ? mocks : false,
  resolvers,
  server,
  typeDefs,

  formatError
})
