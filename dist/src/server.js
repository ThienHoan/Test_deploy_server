"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
// Khởi động server
app_1.default.start(3000);
console.log('🚀 Server đang chạy tại http://localhost:3000');
console.log('📡 Sẵn sàng nhận request từ Postman!');
