module.exports = (g) => {
  const _ = g.require('underscore')
  const r = g.chai.request(g.baseurl)

  const p = {
    label: 'option1',
    value: 'value1'
  }

  return describe('options', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/${g.optiongroup.slug}`).send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without appropriate group', async () => {
      const res = await r.post(`/${g.optiongroup.slug}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(401)
    })

    it('shall create a new item without mandatory item', async () => {
      g.mockUser.groups = [ 'admins' ]
      const res = await r.post(`/${g.optiongroup.slug}`).send(_.omit(p, 'label'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      const res = await r.post(`/${g.optiongroup.slug}`).send(p)
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
      const res = await r.put(`/${g.optiongroup.slug}/${p.value}`)
        .send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the options', async () => {
      const res = await r.get(`/${g.optiongroup.slug}`)
      res.body.length.should.eql(1)
      res.body[0].label.should.eql('pok1changed')
      res.should.have.status(200)
    })
  })
}
