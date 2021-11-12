import path from 'path'
import express from 'express'
import cors from 'cors'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import auth from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import { setup as setupOrgID, loadOrgID } from 'modularni-urad-utils/orgid'
import { setup as setupCORS, configCallback } from 'modularni-urad-utils/cors'
import GetConfigWatcher from 'modularni-urad-utils/config'
import initRoutes from './api/routes'
import { MULTITENANT } from './consts'

export default async function init (mocks = null) {
  const confWatcher = GetConfigWatcher(process.env.CONFIG_FOLDER)
  const loadedPromise = new Promise((resolve, reject) => {
    confWatcher.on('loaded', configs => {
      MULTITENANT && setupOrgID(configs)
      setupCORS(configs)
      resolve()
    })
    confWatcher.on('changed', (orgid, configs) => {
      MULTITENANT && setupOrgID(configs)
      setupCORS(configs)
    })
  })

  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()

  const app = express()
  MULTITENANT && app.use(loadOrgID)
  process.env.NODE_ENV !== 'test' && app.use(cors(configCallback))

  const appContext = { express, knex, auth }
  initRoutes(appContext, app)

  initErrorHandlers(app) // ERROR HANDLING
  await loadedPromise
  return app
}
