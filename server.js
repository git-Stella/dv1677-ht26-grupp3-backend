// EFTER — hela filen ersätts
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.mjs';

const PORT = process.env.PORT || 3000;

// Samma server som app.listen() skapade åt er — nu synlig
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' }        // ← Socket.io har EGEN cors-konfiguration
});

io.on('connection', (socket) => {
  console.log('ansluten:', socket.id);

  socket.on('join', (rum) => {
    socket.join(rum);
  });

  socket.on('disconnect', () => {
    console.log('frånkopplad:', socket.id);
  });
});

// Notera: httpServer.listen, INTE app.listen
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});