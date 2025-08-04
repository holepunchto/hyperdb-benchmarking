const HyperDB = require('hyperdb/builder')
const Hyperschema = require('hyperschema')
const path = require('path')

const setupSchema = (schemaDir) => {
  const schema = Hyperschema.from(schemaDir)
  const ns = schema.namespace('x')

  ns.register({
    name: 'a',
    fields: [
      {
        name: 'a',
        type: 'string',
        required: true
      },
      {
        name: 'b',
        type: 'uint',
        required: true
      },
      {
        name: 'c',
        type: 'string',
        required: true
      },
      {
        name: 'd',
        type: 'uint',
        required: true
      },
      {
        name: 'e',
        type: 'string',
        required: true
      },
      {
        name: 'f',
        type: 'string',
        required: true
      },
      {
        name: 'g',
        type: 'uint',
        required: true
      },
      {
        name: 'h',
        type: 'uint',
        required: false
      },
      {
        name: 'i',
        type: 'uint',
        required: false
      },
      {
        name: 'j',
        type: 'string',
        required: false
      },
      {
        name: 'k',
        type: 'string',
        required: false
      }
    ]
  })

  ns.register({
    name: 'b',
    fields: [
      {
        name: 'a',
        type: 'string',
        required: true
      },
      {
        name: 'b',
        type: 'uint',
        required: true
      },
      {
        name: 'c',
        type: 'string',
        required: true
      },
      {
        name: 'd',
        type: 'uint',
        required: true
      }
    ]
  })

  Hyperschema.toDisk(schema)
}

const setupDb = (schemaDir, dbDir) => {
  const db = HyperDB.from(schemaDir, dbDir)
  const ns = db.namespace('x')

  ns.collections.register({
    name: 'a',
    schema: '@x/a',
    key: ['c', 'd']
  })

  ns.collections.register({
    name: 'b',
    schema: '@x/b',
    key: ['b']
  })

  ns.indexes.register({
    name: 'c',
    collection: '@x/a',
    key: ['b']
  })
  ns.indexes.register({
    name: 'd',
    collection: '@x/a',
    key: ['c']
  })
  ns.indexes.register({
    name: 'e',
    collection: '@x/a',
    key: ['g']
  })

  ns.indexes.register({
    name: 'f',
    collection: '@x/b',
    unique: true,
    key: ['c']
  })
  ns.indexes.register({
    name: 'g',
    collection: '@x/b',
    key: ['d']
  })

  HyperDB.toDisk(db)
}

module.exports = {
  setupSchema,
  setupDb
}

if (require.main === module) {
  const schemaDir = path.join(__dirname, 'spec', 'hyperschema')
  const dbDir = path.join(__dirname, 'spec', 'hyperdb')

  setupSchema(schemaDir)
  setupDb(schemaDir, dbDir)
}
