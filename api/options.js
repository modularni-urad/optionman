
import { TABLE_NAMES, getQB } from '../consts'
const conf = {
  tablename: TABLE_NAMES.OPTIONS,
  editables: ['text', 'value', 'note']
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update }
  
  async function create (slug, body, user, schema) {
    const group = await getQB(knex, TABLE_NAMES.GROUPS, schema).where({ slug }).first()
    if (! _.contains(user.groups, group.owner)) {
      throw new ErrorClass(401, 'not allowed update')
    }
    const data = _.extend(body, { parent: group.slug })
    try {
      return await getQB(knex, TABLE_NAMES.OPTIONS, schema).insert(data).returning('*')
    } catch(err) {
      throw new ErrorClass(400, 'wrong data:' + err.toString())
    }
  }

  async function update (slug, value, body, user, schema) {
    const group = await getQB(knex, TABLE_NAMES.GROUPS, schema).where({ slug }).first()
    if (! _.contains(user.groups, group.owner)) {
      throw new ErrorClass(401, 'not allowed update')
    }
    return getQB(knex, TABLE_NAMES.OPTIONS, schema)
      .where({ value, parent: group.slug }).update(body).returning('*')
  }

  async function list (query, slug, schema) {
    Object.assign(query.filter, { parent: slug })
    return MW.list(query, schema)
  }
}