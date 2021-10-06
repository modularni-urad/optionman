import { TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.OPTIONS, (table) => {
    table.integer('parentid').notNullable()
      .references('id').inTable(TABLE_NAMES.GROUPS)
    table.string('label', 64).notNullable()
    table.string('value', 64).notNullable()
    table.string('note', 64)
    table.primary(['parentid', 'value'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.OPTIONS)
}
