/* global describe it */
import _ from 'underscore'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const p = {
    group: 'users'
  }

  return describe('groups', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const res = await r.post('/').send(p)
      res.should.have.status(400)
    })

    it('must not create a new item without mandatory item', async () => {
      const res = await r.post('/').send(_.omit(p, 'group'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item', async () => {
      const res = await r.post('/').send(p).set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
      p.id = res.body[0]
      g.optiongroup = p
    })

    it('shall update the item pok1', async () => {
      const change = {
        group: 'admins'
      }
      const res = await r.put(`/${p.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })
    
  })
}
