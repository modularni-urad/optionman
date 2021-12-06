import Groups from './groups'
import Options from './options'

export default (ctx) => {
  const { auth, express, bodyParser } = ctx
  const app = express()
  const groups = Groups(ctx)
  const options = Options(ctx)

  app.post('/', auth.session, auth.required, bodyParser, (req, res, next) => {
    groups.create(req.body, req.tenantid)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/', auth.session, auth.required, (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    groups.list(req.query, req.tenantid)
      .then(data => {
        res.json(data)
      })
      .catch(next)
  })

  app.put('/:id', auth.session, auth.required, bodyParser, (req, res, next) => {
    groups.update(req.params.id, req.body, req.user, req.tenantid)
      .then(data => res.json(data))
      .catch(next)
  })

  app.post('/:gid', auth.session, auth.required, bodyParser, (req, res, next) => {
    options.create(req.params.gid, req.body, req.user, req.tenantid)
      .then(data => res.json(data))
      .catch(next)
  })

  app.get('/:gid', (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    options.list(req.query, req.params.gid, req.tenantid)
      .then(data => res.json(data))
      .catch(next)
  })

  app.put('/:gid/:val', auth.session, auth.required, bodyParser, (req, res, next) => {
    options.update(req.params.gid, req.params.val, req.body, req.user, req.tenantid)
      .then(data => res.json(data))
      .catch(next)
  })

  return app
}
