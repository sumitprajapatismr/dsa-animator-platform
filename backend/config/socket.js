import Room from '../models/Room.js';

export const configureSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room event
    socket.on('join-room', async ({ roomCode, user }) => {
      if (!roomCode || !user) return;
      
      socket.join(roomCode);
      console.log(`User ${user.name} (${user.id}) joined room: ${roomCode}`);

      // Add user to room's active socket members list (in memory or database)
      try {
        const room = await Room.findOne({ roomCode });
        if (room) {
          // Send current room status (code, whiteboard, editor state) back to user
          socket.emit('room-init', {
            code: room.codeContent,
            language: room.language,
            drawings: room.whiteboardDrawings
          });

          // Broadcast notification to others in the room
          socket.to(roomCode).emit('user-joined', {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          });
        }
      } catch (err) {
        console.error('Socket room join error:', err);
      }
    });

    // Code changes in editor
    socket.on('code-change', ({ roomCode, code }) => {
      socket.to(roomCode).emit('code-update', code);
      
      // Debounced or periodic save can be handled, but for this real-time session, we update DB
      // We can periodically save to DB.
    });

    // Save final code action
    socket.on('save-code', async ({ roomCode, code }) => {
      try {
        await Room.findOneAndUpdate({ roomCode }, { codeContent: code });
      } catch (err) {
        console.error('Failed to auto-save code:', err);
      }
    });

    // Language change in editor dropdown
    socket.on('language-change', async ({ roomCode, language }) => {
      socket.to(roomCode).emit('language-update', language);
      try {
        await Room.findOneAndUpdate({ roomCode }, { language });
      } catch (err) {
        console.error('Failed to update room language:', err);
      }
    });

    // Whiteboard drawing path events
    socket.on('draw', async ({ roomCode, drawData }) => {
      // Broadcast path instantly to other clients for low-latency render
      socket.to(roomCode).emit('draw-update', drawData);

      // Save drawing path to room history
      try {
        await Room.findOneAndUpdate(
          { roomCode },
          { $push: { whiteboardDrawings: drawData } }
        );
      } catch (err) {
        console.error('Failed to append drawing point:', err);
      }
    });

    // Clear whiteboard action
    socket.on('clear-whiteboard', async (roomCode) => {
      socket.to(roomCode).emit('whiteboard-cleared');
      try {
        await Room.findOneAndUpdate(
          { roomCode },
          { $set: { whiteboardDrawings: [] } }
        );
      } catch (err) {
        console.error('Failed to clear drawings:', err);
      }
    });

    // Chat Message
    socket.on('send-message', ({ roomCode, message }) => {
      // Message contains { user: {name, avatar}, text: string, timestamp: Date }
      socket.to(roomCode).emit('receive-message', message);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
