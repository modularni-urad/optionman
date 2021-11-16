import Groups from './groups'
import Options from './options'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const JSONBodyParser = express.json()
  const app = express()

  app.post('/', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    Groups.create(req.body, req.orgconfig.orgid, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/', auth.session, auth.required, (req, res, next) => {
    const query = Object.assign(req.query, { filter: req.query.filter ?
      JSON.parse(req.query.filter) : {} })
    Groups.list(query, req.orgconfig.orgid, knex)
      .then(data => {
        res.json(data)
      })
      .catch(next)
  })

  app.put('/:id', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    Groups.update(req.params.id, req.body, req.orgconfig.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.post('/:gid', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    Options.create(req.params.gid, req.body, req.orgconfig.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/:gid', (req, res, next) => {
    const query = Object.assign(req.query, { filter: req.query.filter ?
      JSON.parse(req.query.filter) : {} })
    Options.list(query, req.params.gid, req.orgconfig.orgid, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  app.put('/:gid/:val', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    Options.update(req.params.gid, req.params.val, req.body, req.orgconfig.orgid, req.user, knex)
      .then(data => res.json(data))
      .catch(next)
  })

  return app
}
