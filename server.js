const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*" // Cho phép kết nối từ mọi nguồn
  }
});

// Route gốc để test
app.get('/', (req, res) => {
  res.send('Socket.IO Chat Server is running!');
});

// Xử lý Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', { 
      id: socket.id, 
      text: msg 
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});