export function registerBookingSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join:resource', (resourceId) => {
      socket.join(`resource:${resourceId}`)
    })
    socket.on('join:booking', (bookingId) => {
      socket.join(`booking:${bookingId}`)
    })
  })
}