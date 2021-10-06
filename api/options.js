import _ from 'underscore'
import { TABLE_NAMES, MULTITENANT } from '../consts'
import entity from 'entity-api-base'
const conf = {
  tablename: TABLE_NAMES.OPTIONS,
  editables: ['label', 'value', 'note']
}

export default { create, list, update }
  
async function create (id, body, orgid, user, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  if (! _.contains(user.groups, group.owner)) throw new Error('not allowed update')
  const data = _.extend(body, { parentid: group.id })
  return knex(TABLE_NAMES.OPTIONS).insert(data).returning('*')
}

async function update (id, value, body, orgid, user, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  if (! _.contains(user.groups, group.owner)) throw new Error('not allowed update')
  return knex(TABLE_NAMES.OPTIONS)
    .where({ value, parentid: group.id }).update(body).returning('*')
}

async function list (query, id, orgid, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  Object.assign(query.filter, { parentid: group.id })
  return entity.list(query, conf, knex)
}