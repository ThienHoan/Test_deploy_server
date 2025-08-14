"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var schema = require("../drizzle/schema");
// Tạo kết nối PostgreSQL
var pool = new pg_1.Pool({
    connectionString: 'postgres://postgres:%40Thien1411@localhost:5432/day4',
});
// Tạo ORM drizzle
exports.db = (0, node_postgres_1.drizzle)(pool, { schema: schema });
