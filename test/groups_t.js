/* global describe it */
import _ from 'underscore'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const p = {
    name: 'pok',
    owner: 'users'
  }

  return describe('groups', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const res = await r.post('/').send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      const res = await r.post('/').send(_.omit(p, 'owner'))
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
        owner: 'admins'
      }
      const res = await r.put(`/${p.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the groups', async () => {
      const res = await r.get(`/`).set('Authorization', 'Bearer f')
      res.body.length.should.eql(1)
      res.body[0].owner.should.eql('admins')
      res.should.have.status(200)
    })
    
  })
}
