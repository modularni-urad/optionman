import Groups from './groups'
import Options from './options'
import loadOrgID from './orgid_man'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const app = express()
  const JSONBodyParser = express.json()

  app.post('/', loadOrgID, auth.required, JSONBodyParser, (req, res, next) => {
    Groups.create(req.body, req.orgid, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/', loadOrgID, auth.required, (req, res, next) => {
    Groups.list(req.orgid, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.put('/:id', loadOrgID, auth.required, JSONBodyParser, (req, res, next) => {
    Groups.update(req.params.id, req.body, req.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.post('/:gid', loadOrgID, auth.required, JSONBodyParser, (req, res, next) => {
    Options.create(req.params.gid, req.body, req.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/:gid', loadOrgID, (req, res, next) => {
    Options.list(req.params.gid, req.orgid, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.put('/:gid/:val', loadOrgID, auth.required, JSONBodyParser, (req, res, next) => {
    Options.update(req.params.gid, req.params.val, req.body, req.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  return app
}
