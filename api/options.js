import _ from 'underscore'
import { TABLE_NAMES, MULTITENANT } from '../consts'

export default { create, list, update }
  
async function create (id, body, orgid, user, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  if (! _.contains(user.groups, group.group)) throw new Error('not allowed update')
  const data = _.extend(body, { parentid: group.id })
  return knex(TABLE_NAMES.OPTIONS).insert(data).returning('*')
}

async function update (id, value, body, orgid, user, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  if (! _.contains(user.groups, group.group)) throw new Error('not allowed update')
  return knex(TABLE_NAMES.OPTIONS)
    .where({ value, parentid: group.id }).update(body).returning('*')
}

async function list (id, orgid, knex) {
  const cond = MULTITENANT ? { orgid, id } : { id }
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  return knex(TABLE_NAMES.OPTIONS).where({ parentid: group.id })
}