import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
import classNames from 'classnames';
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { 
    changePlayingTrackOnPreloadTrack, 
    handleMixQueue, 
    handleUnMixQueue, 
    requirePreloadTrack, 
    setPlayingTrackArrayId, 
    setPlayingTrackPrev 
} from "../../features/userSettings/userSettings";

const Player = () => {
    const getPlayingTrack = useSelector((state) => state.userSettings.playingTrackData);
    const preloadTrackData = useSelector((state) => state.userSettings.preloadTrackData);
    const reactPlayerRef = useRef(null);
    const intervalID = useRef(null);
    const dispatch = useDispatch();

    const [trackDuration, setTrackDuration] = useState("");
    const [trackDurationTime, setTrackDurationTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMixed, setIsMixed] = useState(false);
    const [timePlayed, setTimePlayed] = useState("00:00");
    const [playedPercentage, setPlayedPercentage] = useState(0);
    const [timeToRewind, setTimeToRewind] = useState(0);
    const [startAnimationPlayer, setStartAnimationPlayer] = useState(false);

    const [circleVisible, setCircleVisible] = useState(false);
    const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (getPlayingTrack === undefined) {
            dispatch(setPlayingTrackArrayId(0));
            setStartAnimationPlayer(true);
        }
    }, [isPlaying, getPlayingTrack, dispatch]);

    useEffect(() => {
        setStartAnimationPlayer(false);
    }, []);

    const handleMouseMove = (e) => {
        const timelineRect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - timelineRect.left;
        const percentage = offsetX / timelineRect.width;
        const currentSecond = Math.round(trackDurationTime * percentage);
        setCirclePosition({ x: offsetX, y: timelineRect.height / 2 });
        setTimeToRewind(currentSecond);
    };

    const handleMouseEnter = () => {
        setCircleVisible(true);
    };

    const handleMouseLeave = () => {
        setCircleVisible(false);
    };

    const topControlsPlayClassList = classNames({
        [styles.topControls__play]: !isPlaying,
        [styles.topControls__pause]: isPlaying,
    });

    const mixedControlsPlayClassList = classNames({
        [styles.topControls__mix__clicked]: !isMixed,
        [styles.topControls__mix]: isMixed,
    });

    const handlePlayOnReady = () => {
        setIsPlaying(true);
        setStartAnimationPlayer(true);
        if (intervalID.current !== null) {
            clearInterval(intervalID.current);
        }
        const duration = reactPlayerRef.current.getDuration();
        setTrackDuration(formatTime(duration));
        setTrackDurationTime(duration);

        intervalID.current = setInterval(() => {
            const currentTime = reactPlayerRef.current.getCurrentTime();
            setTimePlayed(formatTime(currentTime));
            setPlayedPercentage((currentTime / duration) * 100);
            if ('mediaSession' in navigator) {
                navigator.mediaSession.setPositionState({
                    duration: duration,
                    playbackRate: 1.0,
                    position: currentTime
                });
            }
        }, 1000);

        if (preloadTrackData === undefined) {
            dispatch(requirePreloadTrack());
        }
    };

    const formatTime = (seconds) => {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().slice(14, 19);
    };

    const handleTrackEnded = () => {
        dispatch(changePlayingTrackOnPreloadTrack());
    };

    const handleTrackNext = () => {
        if (preloadTrackData !== undefined) {
            dispatch(changePlayingTrackOnPreloadTrack());
        }
    };

    const handleTrackPrev = () => {
        dispatch(setPlayingTrackPrev());
    };

    const handleButtonMix = () => {
        if (isMixed) {
            dispatch(handleUnMixQueue());
            dispatch(requirePreloadTrack());
        } else {
            dispatch(handleMixQueue());
            dispatch(requirePreloadTrack());
        }
        setIsMixed(prev => !prev);
    };

    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                setIsPlaying(true);
                reactPlayerRef.current.getInternalPlayer().play();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                setIsPlaying(false);
                reactPlayerRef.current.getInternalPlayer().pause();
            });

            navigator.mediaSession.setActionHandler('previoustrack', handleTrackPrev);

            navigator.mediaSession.setActionHandler('nexttrack', handleTrackNext);

            if (startAnimationPlayer && getPlayingTrack.trackTitle) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: getPlayingTrack.trackTitle,
                    artist: getPlayingTrack.trackArtistsName.join(', '),
                    album: 'Album Name',
                    artwork: [
                        { src: getPlayingTrack.trackCoverUrl, sizes: '96x96', type: 'image/jpeg' },
                        { src: getPlayingTrack.trackCoverUrl, sizes: '128x128', type: 'image/jpeg' },
                        { src: getPlayingTrack.trackCoverUrl, sizes: '192x192', type: 'image/jpeg' },
                        { src: getPlayingTrack.trackCoverUrl, sizes: '256x256', type: 'image/jpeg' },
                        { src: getPlayingTrack.trackCoverUrl, sizes: '384x384', type: 'image/jpeg' },
                        { src: getPlayingTrack.trackCoverUrl, sizes: '512x512', type: 'image/jpeg' }
                    ]
                });
            }
        }
    }, [startAnimationPlayer, getPlayingTrack, handleTrackNext, handleTrackPrev]);

    return (
        <motion.div 
            className={styles.block__player}
            initial={{ display: "none", y: 200 }}
            animate={startAnimationPlayer ? { display: "grid", y: 0 } : ""}
            transition={{ duration: 1 }}
        >
            {getPlayingTrack && (
                <ReactPlayer
                    ref={reactPlayerRef}
                    url={getPlayingTrack.trackUrl}
                    playing={isPlaying}
                    width="100%"
                    height="50px"
                    style={{ display: "none" }}
                    onReady={handlePlayOnReady}
                    onEnded={handleTrackEnded}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                />
            )}

            <div className={styles.player__leftSide}>
                <div className={styles.player__leftSide__cover} style={{ backgroundImage: getPlayingTrack ? `url(${getPlayingTrack.trackCoverUrl})` : {} }}>
                </div>
                <div className={styles.player__leftSide__trackInfo}>
                    <div className={styles.trackInfo__title}>{getPlayingTrack ? getPlayingTrack.trackTitle : "-----"}</div>
                    <div className={styles.trackInfo__author}>{getPlayingTrack ? getPlayingTrack.trackArtistsName : "-----"}</div>
                </div>
            </div>

            <div className={styles.player__centerSide}>
                <div className={styles.player__centerSide__topControls}>
                    <div className={classNames(mixedControlsPlayClassList, styles.topControls__background_img)} onClick={handleButtonMix}></div>
                    <div className={classNames(styles.topControls__prev, styles.topControls__background_img)} onClick={handleTrackPrev}></div>
                    <div className={classNames(topControlsPlayClassList, styles.topControls__background_img)} onClick={() => setIsPlaying(prev => !prev)}></div>
                    <div className={classNames(styles.topControls__next, styles.topControls__background_img)} onClick={handleTrackNext}></div>
                    <div className={classNames(styles.topControls__repeat, styles.topControls__background_img)} ></div>
                </div>
                <div className={styles.player__centerSide__lowerControls}>
                    <div className={styles.lowerControls__timeStart}>{timePlayed}</div>
                    <div
                        className={styles.lowerControls__timeLine}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => reactPlayerRef.current.seekTo(timeToRewind)}
                    >
                        <motion.div
                            className={styles.lowerControls__timeLineListened}
                            initial={{ width: "0%" }}
                            animate={{ width: `${playedPercentage}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                        {circleVisible && (
                            <div>
                                <div
                                    className={styles.circle}
                                    style={{ left: circlePosition.x, top: circlePosition.y }}
                                />
                                <div 
                                    className={styles.circleTime} 
                                    style={{ left: circlePosition.x, top: circlePosition.y }}
                                >
                                    {formatTime(timeToRewind)}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.lowerControls__timeEnd}>{trackDuration}</div>
                </div>
            </div>

            <div className={styles.player__rightSide}>
                <div className={styles.player__rightSide__volume} ></div>
                <div className={styles.player__rightSide__device}></div>
                <div className={styles.player__rightSide__timer}></div>
                <div className={styles.player__rightSide__settings}></div>
            </div>
        </motion.div>
    );
};

export default Player;
