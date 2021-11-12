import _ from 'underscore'
import { APIError } from 'modularni-urad-utils'
import { TABLE_NAMES, MULTITENANT } from '../consts'
import entity from 'entity-api-base'
const conf = {
  tablename: TABLE_NAMES.GROUPS,
  editables: ['name', 'owner']
}

export default { create, list, update }
  
async function create (body, orgid, knex) {
  MULTITENANT && Object.assign(body, { orgid })
  try {
    return await knex(TABLE_NAMES.GROUPS).insert(body).returning('*')
  } catch(err) {
    throw new APIError(400, 'wrong data:' + err.toString())
  }
}

async function update (id, body, orgid, user, knex) {
  const cond = { id }
  MULTITENANT && Object.assign(cond, { orgid })
  return knex(TABLE_NAMES.GROUPS).where(cond).update(body).returning('*')
}

async function list (query, orgid, knex) {
  query.filter = query.filter || {}
  MULTITENANT && Object.assign(query.filter, { orgid })
  return entity.list(query, conf, knex)
}