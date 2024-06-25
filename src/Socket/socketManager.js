import socket from './socket';

export const connectToSocket = () => {
  socket.on('connect', () => {
    console.log('connected to server');
  });

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });
};

export const getAllTracks = (userId) => {
  socket.emit('getAllTracks', userId);
};

export const joinRoom = (userId) => {
  socket.emit('joinRoom', userId);
};

export const sendTrackPause = (userId, trackPause) => {
  const tP = !trackPause;
  socket.emit('changePauseTrack', { userId, tP });
};

export const playNewTrack = (userId, idNewTrack) => {
  socket.emit('changeTrackOnPlay', { userId, idNewTrack });
};

export const preloadTrack = (userId, idTrack) => {
    socket.emit('preloadTrack', { userId, idTrack });
}
