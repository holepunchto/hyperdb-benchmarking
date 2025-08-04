### Benchmarking HyperDB
1. First run `node generate.mjs` to build a bunch of dbs in `./dbs`
2. Then run `node index.js` to benchmark the reads across the DBs.

Can manually rebuild rocksdb-native to test different config options.
