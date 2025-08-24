// Demo sử dụng Viblo Crawler
// File này minh họa cách sử dụng crawler từ backend chính

import { crawlVibloPosts, runCrawler, CRAWLER_CONFIG } from './index.js';

console.log('🚀 Viblo Crawler Demo');
console.log('=====================');

// Hiển thị cấu hình
console.log('\n📋 Cấu hình hiện tại:');
console.log(`- URL: ${CRAWLER_CONFIG.VIBLO_URL}`);
console.log(`- Số bài viết: ${CRAWLER_CONFIG.POSTS_LIMIT}`);
console.log(`- Delay: ${CRAWLER_CONFIG.DELAY_BETWEEN_REQUESTS}ms`);
console.log(`- Timezone: ${CRAWLER_CONFIG.TIMEZONE}`);

// Demo chạy crawler một lần
async function demoCrawler() {
    console.log('\n🔄 Demo chạy crawler một lần...');
    try {
        await crawlVibloPosts();
        console.log('✅ Crawler demo hoàn thành!');
    } catch (error) {
        console.error('❌ Lỗi khi chạy crawler demo:', error.message);
    }
}

// Demo chạy scheduler
function demoScheduler() {
    console.log('\n⏰ Demo chạy scheduler...');
    console.log('Scheduler sẽ chạy crawler mỗi 5 tiếng');
    console.log('Nhấn Ctrl+C để dừng');
    
    try {
        runCrawler();
    } catch (error) {
        console.error('❌ Lỗi khi chạy scheduler demo:', error.message);
    }
}

// Menu demo
console.log('\n📖 Chọn demo:');
console.log('1. Chạy crawler một lần');
console.log('2. Chạy scheduler');
console.log('3. Thoát');

// Đọc input từ user (đơn giản)
process.stdin.on('data', (data) => {
    const choice = data.toString().trim();
    
    switch (choice) {
        case '1':
            demoCrawler();
            break;
        case '2':
            demoScheduler();
            break;
        case '3':
            console.log('👋 Tạm biệt!');
            process.exit(0);
            break;
        default:
            console.log('❓ Lựa chọn không hợp lệ. Vui lòng chọn 1, 2 hoặc 3.');
    }
});

console.log('\nNhập lựa chọn của bạn (1, 2, hoặc 3):');
