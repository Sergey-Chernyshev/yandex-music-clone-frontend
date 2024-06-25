import React, { useState, useEffect } from 'react';
import style from './RoomId.module.css';
import { useSelector } from 'react-redux';

const generateRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
};

const generateRandomCode = (length) => {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += generateRandomChar();
    }
    return code;
};

const RoomId = ({ sendGenerationEnd }) => {
    const [targetCode, setTargetCode] = useState('');
    const [currentCode, setCurrentCode] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [generationEnd, setGenerationEnd] = useState(false);

    const roomUID = useSelector((state) => state.userSettings.roomUID);

    useEffect(() => {
        if (roomUID) {
            setTargetCode(roomUID);
            setCurrentCode(roomUID.split('')); 
            setGenerationEnd(true); 
            sendGenerationEnd({
                generationEnd: true,
                roomUID: roomUID,
            })
        } else {
            const newCode = generateRandomCode(6);
            setTargetCode(newCode);
            setCurrentCode(Array(6).fill(''));
            setCurrentIndex(0);
            setGenerationEnd(false);
        }
    }, [roomUID]);

    useEffect(() => {
        if (!roomUID) {
            const interval = setInterval(() => {
                setCurrentCode((prevCode) =>
                    prevCode.map((char, index) =>
                        index <= currentIndex ? targetCode[index] : generateRandomChar()
                    )
                );
            }, 100);

            return () => clearInterval(interval);
        }
    }, [currentIndex, targetCode, roomUID]);

    useEffect(() => {
        if (!roomUID && currentIndex < targetCode.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 500);
            return () => {
                clearTimeout(timeout);
            };
        }
        if (!roomUID && currentIndex === targetCode.length) {
            setGenerationEnd(true);
            sendGenerationEnd({
                generationEnd: generationEnd,
                roomUID: currentCode.join(''),
            })
        }
    }, [currentIndex, targetCode.length, roomUID]);

    return (
        <div className={style.block__roomId}>
            {currentCode.map((char, index) => (
                <div key={index} className={style.roomId__code}>
                    {char}
                </div>
            ))}
        </div>
    );
};

export default RoomId;
