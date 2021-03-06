import path from 'path'
import express from 'express'

import bdd from './composants/bdd'
import { SERVIR_FICHIERS_STATIQUES, BDD_MAJ_MCD } from './composants/config'

export default app => {
  // app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
  if (SERVIR_FICHIERS_STATIQUES) app.use('/', express.static(path.resolve(__dirname, '../dist')))

  // TODO : Créer le premier compte administrateur lors de la synchronisation de la base de données, au moins en mode développement.
  return bdd.sync({ alter: BDD_MAJ_MCD })
}
