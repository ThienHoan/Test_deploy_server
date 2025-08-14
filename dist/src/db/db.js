"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
console.log('Testing PG import...');
console.log('Pool:', pg_1.Pool);
var pool = new pg_1.Pool({
    connectionString: 'postgresql://neondb_owner:npg_hudU2Y5fneNX@ep-morning-hill-a133txhq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});
exports.default = pool;
