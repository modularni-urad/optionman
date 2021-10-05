import _ from 'underscore'
import { TABLE_NAMES, MULTITENANT } from '../consts'

export default { create, list, update }
  
async function create (body, orgid, knex) {
  MULTITENANT && Object.assign(body, { orgid })
  return knex(TABLE_NAMES.GROUPS).insert(body).returning('*')
}

async function update (id, body, orgid, user, knex) {
  const cond = { id }
  MULTITENANT && Object.assign(cond, { orgid })
  const group = await knex(TABLE_NAMES.GROUPS).where(cond).first()
  return knex(TABLE_NAMES.GROUPS).where(cond).update(body).returning('*')
}

async function list (orgid, knex) {
  return knex(TABLE_NAMES.GROUPS).where({ orgid })
}