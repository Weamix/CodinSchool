const requireModule = require('esm')(module)

const { ACTIVER_MOCKS, GRAPHQL_INTROSPECTION } = requireModule('./apollo-server/composants/config')

module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: ACTIVER_MOCKS,
      enableEngine: false,

      serverOptions: {
        introspection: GRAPHQL_INTROSPECTION
      }
    }
  }
}
