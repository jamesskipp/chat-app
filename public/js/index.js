const socket = io(); // eslint-disable-line no-undef

const locationButton = $('#send-location');
const messageForm = $('#message-form');
const messages = $('#messages');

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

  messages.append(li);
});

socket.on('newLocationMessage', function newLocationMessage(message) {
  const li = $('<li></li>');
  const a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  messages.append(li);
});

socket.emit('createMessage', {
  text: 'Great.',
}, function ack(data) {
  console.log('Got it', data);
});

messageForm.on('submit', function form(event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(),
  }, function emitRes() {

  });
});

locationButton.on('click', function checkIn() {
  if (!navigator.geolocation) {
    return alert('Gelocation not supported on your browser ):');
  }

  return navigator.geolocation.getCurrentPosition(function geoSuccess(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function geoError() {
    alert('Geolocation was unable to fetch your location.');
  });
});
