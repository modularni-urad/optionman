/* global describe it */
import moment from 'moment'
import _ from 'underscore'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p = {
    label: 'option1',
    value: 'value1'
  }

  return describe('options', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/${g.optiongroup.id}`).send(p)
      res.should.have.status(400)
    })

    // it('shall create a new item without mandatory item', async () => {
    //   const res = await r.post(`/${g.optiongroup.id}`).send(_.omit(p, 'label'))
    //     .set('Authorization', 'Bearer f')
    //   res.should.have.status(400)
    // })

    it('must not create a new item without appropriate group', async () => {
      const res = await r.post(`/${g.optiongroup.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      g.mockUser.groups = [ 'admins' ]
      const res = await r.post(`/${g.optiongroup.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
      p.id = res.body[0]
      g.option = p
    })

    it('shall update the item pok1', async () => {
      const change = {
        label: 'pok1changed'
      }
      const res = await r.put(`/${g.optiongroup.id}/${p.value}`)
        .send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the options', async () => {
      const res = await r.get(`/${g.optiongroup.id}`)
      res.body.length.should.eql(1)
      res.body[0].label.should.eql('pok1changed')
      res.should.have.status(200)
    })
  })
}
