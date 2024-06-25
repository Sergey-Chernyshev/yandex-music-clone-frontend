import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from './socket';
import { connectToSocket } from './socketManager';
import { setAllTracksData, setPlayingTrackData, setPreloadTrack, setRoomUID } from '../features/userSettings/userSettings';
import { useDispatch } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const dispatch = useDispatch()


    const [userId, setUserId] = useState("");
    const [trackPause, setTrackPause] = useState(true);
    const [allTracks, setAllTracks] = useState([]);
    const [playingTrack, setPlayingTrack] = useState({});


    useEffect(() => {
        if (allTracks !== undefined && allTracks.length > 0) {
            dispatch(setAllTracksData(allTracks))

        }
    }, [allTracks])

    useEffect(() => {
        connectToSocket();

        socket.on('changePauseTrack', (msg) => {
            setTrackPause(msg);
            console.log("Поменяли тип игры", msg);
        });

        socket.on('getAllTracks', (msg) => {
            console.log("Получение всех треков: ", JSON.parse(msg));
            setAllTracks(JSON.parse(msg));
        });

        socket.on('changePlayingTrack', (msg) => {
            dispatch(setPlayingTrackData(JSON.parse(msg)))
            // dispatch
        });

        socket.on('preloadTrack', (msg) => {
            dispatch(setPreloadTrack(JSON.parse(msg)))  
        })

        return () => {
            socket.off('changePauseTrack');
            socket.off('getAllTracks');
            socket.off('changePlayingTrack');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ userId, setUserId, trackPause, allTracks, playingTrack }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
