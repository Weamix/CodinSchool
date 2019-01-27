import deepmerge from 'deepmerge'

import * as Scalars from './composants/scalars'
import Authentification from './composants/auth/resolvers.js'

export default deepmerge.all([
	{ Query: {}, Mutation: {} },
	Scalars,
	Authentification
])
