const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Thêm route GET "/" để tránh lỗi "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Socket.IO server is running!');
});

// Phần Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});