import { TABLE_NAMES, getQB } from '../consts'
const conf = {
  tablename: TABLE_NAMES.GROUPS,
  editables: ['name', 'owner']
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update }
    
  async function create (body, schema) {
    try {
      return await getQB(knex, TABLE_NAMES.GROUPS, schema).insert(body).returning('*')
    } catch(err) {
      throw new ErrorClass(400, 'wrong data:' + err.toString())
    }
  }

  async function update (slug, body, user, schema) {
    return getQB(knex, TABLE_NAMES.GROUPS, schema)
      .where({ slug }).update(body).returning('*')
  }

  async function list (query, schema) {
    query.filter = query.filter || {}
    return MW.list(query, schema)
  }
}