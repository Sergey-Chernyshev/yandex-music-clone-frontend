// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getAllTracks, joinRoom, playNewTrack, preloadTrack } from '../../Socket/socketManager';

export const userSettings = createSlice({
  name: 'userSettings',
  initialState: {
    roomUID: "",

    // allTracksData
    uploadedTracksData: [],
    queueTracksData: [],
    playingTrackArrayId: -1,
    playingTrackId: undefined,
    playingTrackData: undefined,
    preloadTrackData: undefined
  },
  reducers: {
    setRoomUID: (state, action) => {
      if (state.roomUID !== action.payload){
        state.roomUID = action.payload
        joinRoom(action.payload)
        getAllTracks(state.roomUID)
      }
    },
    setAllTracksData: (state, action) => {
      if(state.uploadedTracksData !== action.payload){
        state.uploadedTracksData = action.payload
        state.queueTracksData = action.payload
      }
    },
    setPlayingTrackId: (state, action) => {
      if (state.playingTrackData !== action.payload){
        playNewTrack(state.roomUID, action.payload)
        state.playingTrackData = action.payload
      }
    },
    setPlayingTrackData: (state, action) => {
      if (state.playingTrackData !== action.payload){
        state.playingTrackData = action.payload
        console.log("new track data: ", action.payload)
        state.preloadTrackData = undefined
      }
    },
    setPlayingTrackPrev: (state) => {
      if (state.playingTrackArrayId !== 0) {
        playNewTrack(state.roomUID, JSON.parse(JSON.stringify(state.queueTracksData))[state.playingTrackArrayId-1].trackId)
        state.playingTrackArrayId -= 1
      }
    },

    setPlayingTrackArrayId: (state, action) => {
      if (state.playingTrackArrayId !== action.payload){
        console.log(action.payload)
        state.playingTrackArrayId = action.payload
      }
      if (state.playingTrackData === undefined && state.queueTracksData.length !== 0){
        let newTrackData = JSON.parse(JSON.stringify(state.queueTracksData))[0]
        console.log(newTrackData)
        state.playingTrackData = newTrackData
        console.log(newTrackData)
        playNewTrack(state.roomUID, newTrackData.trackId)
      }
    },

    requirePreloadTrack(state){
      console.log("prev ch")
      if (state.playingTrackArrayId+1 !== state.uploadedTracksData.length && state.queueTracksData.length > 0) {
        // console.log(state.roomUID, JSON.parse(JSON.stringify(state.uploadedTracksData)), state.playingTrackArrayId, JSON.parse(JSON.stringify(state.uploadedTracksData))[state.playingTrackArrayId+1])
        preloadTrack(state.roomUID, JSON.parse(JSON.stringify(state.queueTracksData))[state.playingTrackArrayId+1].trackId)
        console.log("prev")
      }
    },

    setPreloadTrack(state, action){
      console.log("предзагруженный трек: ", action.payload)
      state.preloadTrackData = action.payload
    },

    changePlayingTrackOnPreloadTrack(state){
      state.playingTrackData = JSON.parse(JSON.stringify(state.preloadTrackData))
      state.playingTrackId = JSON.parse(JSON.stringify(state.preloadTrackData)).trackId
      state.preloadTrackData = undefined
      state.playingTrackArrayId += 1
      console.log(JSON.parse(JSON.stringify(state.queueTracksData)), state.playingTrackId, state.preloadTrackData, state.playingTrackArrayId)
    },
    
    handleMixQueue(state){
      console.log("перемешивание")
      let queue = JSON.parse(JSON.stringify(state.uploadedTracksData))
      for (let i = queue.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }
      console.log(queue)
      queue.unshift(state.playingTrackData)
      state.queueTracksData = queue
      state.preloadTrackData = undefined
      state.playingTrackArrayId = 0
    },
    handleUnMixQueue(state){
      let tracks_data = JSON.parse(JSON.stringify(state.uploadedTracksData))
      state.queueTracksData = tracks_data
      let playingTrackId = JSON.parse(JSON.stringify(state.playingTrackData)).trackId
      tracks_data.forEach((el, index) => {
        if (el.trackId === playingTrackId){
          state.playingTrackArrayId = index
        } 
      });
      state.preloadTrackData = undefined    
    },
  }
});

export const {handleMixQueue, handleUnMixQueue, setPlayingTrackPrev, setRoomUID, setAllTracksData,setPlayingTrackId, setPlayingTrackData, setPlayingTrackArrayId, requirePreloadTrack, setPreloadTrack, changePlayingTrackOnPreloadTrack } = userSettings.actions;

export default userSettings.reducer;
