import HyperDB from 'hyperdb'
import RocksDB from 'rocksdb-native'
import Corestore from 'corestore'
import Rache from 'rache'
import spec from './spec/hyperdb/index.js'

const BATCH_SIZE = 10000

await generateDatabaseRocks('./dbs/1e6.rocks', 1e6)
await generateDatabaseRocks('./dbs/1e5.rocks', 1e5)
await generateDatabaseRocks('./dbs/1e4.rocks', 1e4)
await generateDatabaseBee('./dbs/1e6.bee', 1e6)
await generateDatabaseBee('./dbs/1e5.bee', 1e5)
await generateDatabaseBee('./dbs/1e4.bee', 1e4)
await generateRawDatabase('./dbs/raw-1e6', 1e6)
await generateRawDatabase('./dbs/raw-1e5', 1e5)
await generateRawDatabase('./dbs/raw-1e4', 1e4)

async function generateDatabaseRocks (dir, size) {
  const db = HyperDB.rocks(dir, spec)

  let time = Date.now()

  let tx = db.transaction()
  for (let i = 0; i < size; i++) {
    await tx.insert('@x/b', {
      a: '' + i,
      b: i,
      c: (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64),
      d: Date.now()
    })
    if (i && (i % BATCH_SIZE) === 0) {
      const delta = Date.now() - time
      console.log('hyperdb-rocks inserted:', i, delta, 'ms', Math.round(BATCH_SIZE / delta * 1000), 'per/s')
      time = Date.now()
      await tx.flush()
      tx = db.transaction()
    }
  }

  await tx.flush()
  await db.close()
}

async function generateDatabaseBee (dir, size) {
  const store = new Corestore(dir, { globalCache: new Rache() })
  const db = HyperDB.bee(store.get({ name: 'bee' }), spec)

  let time = Date.now()

  let tx = db.transaction()
  for (let i = 0; i < size; i++) {
    await tx.insert('@x/b', {
      a: '' + i,
      b: i,
      c: (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64),
      d: Date.now()
    })
    if (i && (i % BATCH_SIZE) === 0) {
      const delta = Date.now() - time
      console.log('hyperdb-bee inserted:', i, delta, 'ms', Math.round(BATCH_SIZE / delta * 1000), 'per/s')
      time = Date.now()
      await tx.flush()
      tx = db.transaction()
    }
  }

  await tx.flush()
  await db.close()
  await store.close()
}

async function generateRawDatabase (dir, size) {
  const db = new RocksDB(dir)

  let time = Date.now()

  let tx = db.write()
  for (let i = 0; i < size; i++) {
    tx.tryPut('' + i, Buffer.alloc(1024).fill(Math.floor(Math.random() * 256)))
    if ((i % BATCH_SIZE) === 0) {
      const delta = Date.now() - time
      console.log('raw db inserted:', i, delta, 'ms', Math.round(BATCH_SIZE / delta * 1000), 'per/s')
      time = Date.now()
      await tx.flush()
      await tx.destroy()
      tx = db.write()
    }
  }

  await tx.flush()
  await tx.destroy()
  await db.close()
}
