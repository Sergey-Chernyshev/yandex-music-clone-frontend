import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';

const socket = io('http://192.168.1.75:8000', {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"  
    }
});

function Chart() {
    const [userId, setUserId] = useState("");
    const [trackPause, setTrackPause] = useState(true);
    const [allTracks, setAllTracks] = useState([]);  // Состояние для всех треков


    // const [url, setUrl] = useState(); // Замените на URL вашего аудио
    const [playingTrack, setPlayingTrack] = useState({});

    useEffect(() => {
        // Подписываемся на события сокета при монтировании компонента
        socket.on('connect', () => {
            console.log('connected to server');
        });

        socket.on('disconnect', () => {
            console.log('disconnected from server');
        });

        socket.on('changePauseTrack', (msg) => {
            setTrackPause(msg);
            console.log("Поменяли тип игры", msg);
        });

        socket.on('getAllTracks', (msg) => {
            console.log("Получение всех треков: ", msg);
            setAllTracks(JSON.parse(msg));
        });

        socket.on('changePlayingTrack', (msg) => {
            console.log("Изменение трека:", JSON.parse(msg));
            setPlayingTrack(JSON.parse(msg))
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('changePauseTrack');
            socket.off('getAllTracks');
        };
    }, []);  


    const joinRoom = () => {
        console.log(userId);
        socket.emit('joinRoom', userId);
        getAllTracks()
    };

    const getAllTracks = () => {
        socket.emit('getAllTracks', userId);
    };

    const sendTrackPause = () => {
        const tP = !trackPause;
        console.log(tP);
        socket.emit('changePauseTrack', { userId, tP });
        setTrackPause(tP);
    };

    const playNewTrack = (idNewTrack) => {
        socket.emit('changeTrackOnPlay', { userId, idNewTrack })
    }

    return (
        <div className="App">
            <h1>React with Socket.io</h1>
            <input
                type='text'
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={getAllTracks}>Get Tracks</button>
            <h3> Все треки: </h3>
            <div>
                {Array.isArray(allTracks) ? (
                    allTracks.map((el, id) => (
                        <div key={id}>
                            Title: {el[0]}
                            <button onClick={ () => playNewTrack(el[1]) }>Играть этот трек</button>
                        </div>
                    ))
                ) : (
                    <div>Loading...</div>
                )}
            </div>


            <br />
            ----------------------------------------------
            <br />
            <h4>Играет сейчас: </h4>
            <div className="music-player">
                <ReactPlayer
                    url={playingTrack.url}
                    playing={trackPause}
                    controls={true}
                    width="100%"
                    height="50px"
                />
                <button onClick={sendTrackPause}>{trackPause ? "Воспроизвести" : "Пауза"}</button>
            </div>
        </div>
    );
}

export default Chart;
