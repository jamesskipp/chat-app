const socket = io(); // eslint-disable-line no-undef

const locationButton = $('#send-location');
const messageForm = $('#message-form');
const messageText = $('[name=message]');

function scrollToBottom() {
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function connect() {
  const params = jQuery.deparam(window.location.search);

  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No Error');
    }
  });
});

socket.on('disconnect', function disconnect() {
  console.log('disconnected from server');
});

socket.on('updateUserList', (users) => {
  const ol = $('<ol></ol>');

  users.forEach((user) => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();

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
