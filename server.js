import path from 'path'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
process.env.DATABASE_URL='postgresql://test:test@server.dhkm.cz:5432/testdb'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')
process.env.SESSION_SERVICE_PORT = 24000
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
process.env.CONFIG_FOLDER = path.join(__dirname, 'test/configs')
const g = {
  port,
  baseurl: `http://localhost:${port}`,
  mockUser: { id: 42 },
  sessionBasket: []
}
g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)

const InitApp = require('./index').default

InitApp().then(app => {
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`optionman listens on ${host}:${port}`)
  })
}).catch(err => {
  console.error(err)
})

import path from 'path'
import express from 'express'
import cors from 'cors'
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

  const app = express()
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))

  const appContext = { express, knex, auth }
  const api = initAPI(appContext)

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    return req.params.domain
  })
  app.use('/:domain', loadOrgConfig, api)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}
