import HyperDB from 'hyperdb'
import spec from './spec/hyperdb/index.js'

const BATCH_SIZE = 10000

// await generateDatabase('./dbs/1e7', 1e7)
await generateDatabase('./dbs/1e6', 1e6)
await generateDatabase('./dbs/1e5', 1e5)
await generateDatabase('./dbs/1e4', 1e4)

async function generateDatabase (dir, size) {
  const db = HyperDB.rocks(dir, spec)

  let tx = db.transaction()
  for (let i = 0; i < size; i++) {
    await tx.insert('@x/b', {
      a: '' + i,
      b: i,
      c: (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64),
      d: Date.now()
    })
    if ((i % BATCH_SIZE) === 0) {
      console.log('inserted:', i)
      await tx.flush()
      tx = db.transaction()
    }
  }

  await tx.flush()
  await db.close()
}
