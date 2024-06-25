import React, { useState, useEffect, useRef } from 'react';
import style from './RoomId.module.css';

const RoomIdInput = ({ sendGenerationEnd }) => {
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [roomUID, setRoomUID] = useState(Array(inputRefs.length).fill(''));

    useEffect(() => {
        inputRefs[0].current.focus();
    }, []);

    const handleChange = (e, index) => {
        const newRoomUID = [...roomUID];
        newRoomUID[index] = e.target.value;

        if (e.target.value.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }

        setRoomUID(newRoomUID);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs[index - 1].current.focus();
            const newRoomUID = [...roomUID];
            newRoomUID[index - 1] = '';
            setRoomUID(newRoomUID);
        }
    };

    useEffect(() => {
        console.log(roomUID.join("").length)
        if (roomUID.join("").length === 6) {
            sendGenerationEnd({
                generationEnd: true,
                roomUID: roomUID.join(''),
            });
        }
        else{
            sendGenerationEnd({
                generationEnd: false,
                roomUID: roomUID.join(''),
            });
        }
    }, [roomUID]);

    const handleBeforeInput = (e) => {
        const char = e.data;
        const isValidChar = /^[a-zA-Z0-9]+$/.test(char);
        
        if (!isValidChar) {
          e.preventDefault();
        }
      };
    

    return (
        <div className={style.block__roomId}>
            {inputRefs.map((ref, index) => (
                <input
                    className={style.roomIdInputCode}
                    maxLength={1}
                    key={index}
                    ref={ref}
                    onBeforeInput={handleBeforeInput}
                    value={roomUID[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
};

export default RoomIdInput;
