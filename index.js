import path from 'path'
import express from 'express'
import cors from 'cors'
import { attachPaginate } from 'knex-paginate'
import {
  auth, initDB,
  initErrorHandlers,
  initConfigManager,
  CORSconfigCallback,
  createLoadOrgConfigMW
} from 'modularni-urad-utils'
import initAPI from './api/routes'

export default async function init (mocks = null) {
  await initConfigManager(process.env.CONFIG_FOLDER)

  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()

  const app = express()
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))

  const appContext = { express, knex, auth }
  const api = initAPI(appContext)

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    return req.params.domain
  })
  app.use('/:domain/', loadOrgConfig, api)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}
