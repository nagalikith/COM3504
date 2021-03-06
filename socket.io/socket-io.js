exports.init = function(io) {

  const chat = io
      .of('/chat')
      .on('connection', function (socket) {
        try {
          /**
           * it creates or joins a room
           */
          socket.on('create or join', function (room, userId) {
            socket.join(room);
            chat.to(room).emit('joined', room, userId);
          });

          socket.on('chat', function (room, userId, chatText) {
            chat.to(room).emit('chat', room, userId, chatText);
          });

          socket.on('disconnect', function () {
            console.log('someone disconnected');
          });

          socket.on('draw', function(room, userId, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness){
              // console.log('X:' + currX + '  Y:' + currY);
              socket.broadcast.emit('drawing', room, userId, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness);
          });


        } catch (e) {
        }
      });
}