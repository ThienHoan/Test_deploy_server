import { Pool } from 'pg';

async function resetTable() {
  const pool = new Pool({
    connectionString: 'postgres://postgres:%40Thien1411@localhost:5432/day4',
  });

  try {
    console.log('🗑️  Đang xóa bảng users cũ...');
    await pool.query('DROP TABLE IF EXISTS users;');
    console.log('✅ Đã xóa bảng users cũ');
    
    console.log('🔄 Đang tạo bảng users mới...');
    await pool.query(`
      CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);
    console.log('✅ Đã tạo bảng users mới với cấu trúc đúng');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await pool.end();
  }
}

resetTable();
