const socket = io(); // eslint-disable-line no-undef

socket.on('connect', function connect() {
  console.log('Connected to server');
});

socket.on('disconnect', function disconnect() {
  console.log('disconnected from server');
});

socket.on('newMessage', function newMessage(message) {
  console.log('newMessage', message);
  const li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  $('#messages').append(li);
});

socket.emit('createMessage', {
  text: 'Great.',
}, function ack(data) {
  console.log('Got it', data);
});

$('#message-form').on('submit', function form(event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(),
  }, function () {
    
  });
});
