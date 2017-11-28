const socket = io(); // eslint-disable-line no-undef

socket.on('connect', function connect() {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
