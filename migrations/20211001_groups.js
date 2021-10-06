import _ from 'underscore'
import { MULTITENANT, TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.GROUPS, (table) => {
    table.increments('id').primary()
    MULTITENANT && table.integer('orgid').notNullable()
    table.string('name', 64).notNullable()
    table.string('owner', 64).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.GROUPS)
}
