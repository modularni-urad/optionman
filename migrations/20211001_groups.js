import { TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.createTable(TABLE_NAMES.GROUPS, (table) => {
    table.string('slug').primary()
    table.string('name', 64).notNullable()
    table.string('owner', 64).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.dropTable(TABLE_NAMES.GROUPS)
}
