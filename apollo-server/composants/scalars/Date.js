import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const dureeJour = 24 * 60 * 60 * 1000 // en ms

const retirerHeures = date => new Date(date.getTime() - date.getTime() % dureeJour)

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Représente une date quelconque (ex : Mardi 1 Janvier 2019). Ne prends pas en compte les heures.',
  serialize(valeur) {
    return retirerHeures(valeur).toJSON()
  },
  parseValue(valeur) {
    const date = new Date(valeur);
    if (Number.isNaN(date.getTime()))
      throw new TypeError('Date invalide.')
    return retirerHeures(date)
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.INT:
      case Kind.STRING:
        const date = new Date(ast.value);
        if (Number.isNaN(date.getTime()))
          throw new TypeError('Date invalide.')
        return retirerHeures(date)
    }
    return null;
  }
})
