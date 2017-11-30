const socket = io(); // eslint-disable-line no-undef

const locationButton = $('#send-location');
const messageForm = $('#message-form');
const messages = $('#messages');
const messageText = $('[name=message]');

socket.on('connect', function connect() {
  console.log('Connected to server');
});

socket.on('disconnect', function disconnect() {
  console.log('disconnected from server');
});

socket.on('newMessage', function newMessage(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });

  $('#messages').append(html);
});

socket.on('newLocationMessage', function newLocationMessage(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url,
  });

  $('#messages').append(html);

  // const formattedTime = moment(message.createdAt).format('h:mm a');
  // const li = $('<li></li>');
  // const a = jQuery('<a target="_blank">My Current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  //
  // messages.append(li);
});

messageForm.on('submit', function form(event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(),
  }, function emitRes() {
    messageText.val('');
  });
});

locationButton.on('click', function checkIn() {
  if (!navigator.geolocation) {
    return alert('Gelocation not supported on your browser ):');
  }

  locationButton.attr('disabled', 'disabled').text('Sending...');

  return navigator.geolocation.getCurrentPosition(function geoSuccess(position) {
    locationButton.removeAttr('disabled').text('Check In');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function geoError() {
    alert('Geolocation was unable to fetch your location.');
    locationButton.removeAttr('disabled').text('Check In');
  });
});
