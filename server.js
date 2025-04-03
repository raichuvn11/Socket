const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép tất cả client kết nối
    methods: ["GET", "POST"]
  }
});

// Danh sách người dùng đang kết nối
const users = {};

// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Thêm sự kiện khi client gửi username
  socket.on('register user', (username) => {
    users[socket.id] = username;
    console.log(`User registered: ${username}`);
    io.emit('user list', Object.values(users));
  });

  // Xử lý tin nhắn từ client
  socket.on('new message', (data) => {
    console.log(`Message from ${data.username}: ${data.message}`);
    
    // Gửi tin nhắn đến tất cả client
    io.emit('new message', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // Xử lý ngắt kết nối
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${users[socket.id] || socket.id}`);
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});