import { Pool } from 'pg';

async function checkTableStructure() {
  const pool = new Pool({
    connectionString: 'postgres://postgres:%40Thien1411@localhost:5432/day4',
  });

  try {
    console.log('🔍 Kiểm tra cấu trúc bảng users...');
    
    // Kiểm tra xem bảng users có tồn tại không
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    console.log('📋 Bảng users có tồn tại:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Kiểm tra cấu trúc cột
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('📊 Cấu trúc bảng hiện tại:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Đề xuất giải pháp
      console.log('\n💡 Giải pháp:');
      console.log('1. Xóa bảng cũ và tạo lại:');
      console.log('   DROP TABLE users;');
      console.log('2. Hoặc chạy lại migration');
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await pool.end();
  }
}

checkTableStructure();
