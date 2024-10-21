// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static('public')); // Serve static files from the public directory

// // When a user connects to the socket
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for location updates from the client
//   socket.on('send-location', (location) => {
//     console.log('Location received:', location);
//     // Broadcast the location to all other clients
//     socket.broadcast.emit('received-location', { id: socket.id, ...location });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from 'public' folder

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for location updates from the client
  socket.on('send-location', (data) => {
    // Broadcast location to other clients
    socket.broadcast.emit('received-location', { id: socket.id, ...data });
  });

  // Handle user disconnection
  socket.on('disconnect-location', () => {
    console.log('User disconnected:', socket.id);
    // Optionally, you can remove the marker for this user
    socket.broadcast.emit('remove-marker', { id: socket.id });
  });

  // Handle user disconnection (default)
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     // Optionally, you can remove the marker for this user
//     socket.broadcast.emit('remove-marker', { id: socket.id });
//   });
});

// Set the server to listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
