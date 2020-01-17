const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculatorDistance = require('./utils/calculateDistance');

let io;

// Poderia ser um banco de dados, ou um redis.
const connections = [];

exports.setupWebSocket = (server) => {
  io = socketio(server);

  io.on('connect', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return calculatorDistance(coordinates, connection.coordinates) < 10
    && connection.techs.some(item => techs.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}