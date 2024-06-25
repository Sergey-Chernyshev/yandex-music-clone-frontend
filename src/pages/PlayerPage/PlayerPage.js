import React, { useEffect } from 'react'
import AllTracks from '../../Components/AllTracksComponents/AllTracks'
import Player from '../../Components/PlayerComponents/Player'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { joinRoom } from '../../Socket/socketManager';

export default function PlayerPage() {
    const navigate = useNavigate()
    const roomUID = useSelector((state) => state.userSettings.roomUID);




    useEffect(() => {
        if (roomUID === "") {
            navigate("/createroom");
        }
    }, [roomUID, navigate]);

    return (
        <>
            <AllTracks />
            <Player />
        </>
    )
}
