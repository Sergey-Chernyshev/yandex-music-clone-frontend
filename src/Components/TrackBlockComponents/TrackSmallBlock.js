
import { useDispatch } from "react-redux"
import style from "./TrackSmallBlock.module.css"
import { setPlayingTrackArrayId, setPlayingTrackId } from "../../features/userSettings/userSettings"
import { useEffect, useRef, useState } from "react"

const TrackSmallBlock = ({trackData, trackIndex}) => {
    const dispatch = useDispatch()
    const handlePlayTrackButton = () => {
        // console.log(trackIndex)
        dispatch(setPlayingTrackId(trackData.trackId))
        dispatch(setPlayingTrackArrayId(trackIndex))
    }




    return (
        <div className={style.block__smallTrack_t1} onClick={handlePlayTrackButton} >
            <div className={style.t1__cover} style={{ backgroundImage: `url(${trackData.trackCoverUrl})` }}>
                <div className={style.t1__cover__play}></div>
            </div>
            <div className={style.t1__info}>
                <div className={style.t1__info__title}>{trackData.trackTitle}</div>
                <div className={style.t1__info__author}>{trackData.trackArtistsName}</div>
            </div>
            <div className={style.t1__like}></div>
        </div>
    )
}

export default TrackSmallBlock