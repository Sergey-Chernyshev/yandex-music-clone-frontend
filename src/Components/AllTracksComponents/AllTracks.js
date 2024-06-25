import { useSelector } from "react-redux";
import TrackSmallBlock from "../TrackBlockComponents/TrackSmallBlock";
import style from "./AllTracks.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

const AllTracks = () => {
    const uploadedTracksData = useSelector((state) => state.userSettings.uploadedTracksData);

    
    const [maxTrackIdVisible, setMaxTrackIdVisible] = useState(0)

    const visibleTracksData = useMemo(() => uploadedTracksData.slice(0, maxTrackIdVisible + 30), [uploadedTracksData, maxTrackIdVisible]);
    
    const trackRefs = useRef([]);
    const [isVisible, setIsVisible] = useState([]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = trackRefs.current.indexOf(entry.target);
                        if (index !== -1) {
                            setIsVisible((prevState) => {
                                const newState = [...prevState];
                                newState[index] = true;
                                return newState;
                            });
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        trackRefs.current.forEach((track) => {
            if (track) observer.observe(track);
        });

        return () => {
            trackRefs.current.forEach((track) => {
                if (track) observer.unobserve(track);
            });
        };
    }, [visibleTracksData]);

    useEffect(() => {
        setMaxTrackIdVisible(isVisible.length)
    }, [isVisible, visibleTracksData]);


    return (
        <div className={style.AllTracks}>
            {uploadedTracksData.length === 0 ? (
                "Загрузка..."
            ) : (
                visibleTracksData.map((track, index) => (
                    <div
                        key={index} // Используйте уникальный идентификатор трека, если он есть, иначе индекс
                        ref={(el) => (trackRefs.current[index] = el)}
                    >
                        <TrackSmallBlock trackData={track} trackIndex={index} />
                    </div>
                ))
            )}
        </div>
    );
};

export default AllTracks;
