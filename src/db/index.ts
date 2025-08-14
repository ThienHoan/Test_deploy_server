import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';

// Tạo kết nối PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://postgres:%40Thien1411@localhost:5432/day4',
});

// Tạo ORM drizzle
export const db = drizzle(pool, { schema });
