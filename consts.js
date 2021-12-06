export const TABLE_NAMES = {
  GROUPS: 'optionman_groups',
  OPTIONS: 'optionman_options'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}