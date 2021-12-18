import { TABLE_NAMES } from '../consts'

function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TABLE_NAMES.OPTIONS, (table) => {
    table.string('parent').notNullable()
      .references('slug').inTable(tableName(TABLE_NAMES.GROUPS))
    table.string('text', 64).notNullable()
    table.string('value', 64).notNullable()
    table.string('note', 64)
    table.primary(['parent', 'value'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return knex.schema.dropTable(TABLE_NAMES.OPTIONS)
}
