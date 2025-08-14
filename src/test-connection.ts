import { db } from './db/index';
import { User } from './drizzle/schema';

async function testConnection() {
  try {
    console.log('🔄 Đang kiểm tra kết nối database...');
    
    // Thử thực hiện một query đơn giản để test kết nối
    const result = await db.select().from(User).limit(1);
    
    console.log('✅ Kết nối database thành công!');
    console.log('📊 Số lượng users hiện tại:', result.length);
    
    if (result.length > 0) {
      console.log('👤 User đầu tiên:', result[0]);
    } else {
      console.log('ℹ️  Chưa có user nào trong database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi kết nối database:');
    console.error(error);
    process.exit(1);
  }
}

// Chạy test
testConnection();
