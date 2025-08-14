import { Pool } from 'pg';

console.log('Testing PG import...');
console.log('Pool:', Pool);

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_hudU2Y5fneNX@ep-morning-hill-a133txhq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});

export default pool;
