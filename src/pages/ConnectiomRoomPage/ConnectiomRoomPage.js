import React, { useMemo, useState } from 'react'
import classNames from 'classnames'

import style from "./ConnectiomRoomPage.module.css"
import RoomId from '../../Components/CreationRoomPageComponents/RoomIdComponent/RoomId'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setRoomUID } from '../../features/userSettings/userSettings'
import { useSocket } from '../../Socket/SocketProvider'
import { joinRoom } from '../../Socket/socketManager'
import RoomIdInput from '../../Components/CreationRoomPageComponents/RoomIdComponent/RoomIdInput'

export default function ConectionRoomPage() {
  const navigate = useNavigate()
  const [generationCodeEnd, setGenerationCodeEnd] = useState(false)
  const dispatch = useDispatch()

  const socket = useSocket();


  const handleGenerationEnd = (data) => {
    if (data.generationEnd) {
      setGenerationCodeEnd(data.generationEnd)
      dispatch(setRoomUID(data.roomUID))
      console.log(data)
      
    }
  }

  const topControlsPlayClassList = classNames({
    [style.creationRoom__button__active]: generationCodeEnd,
    [style.creationRoom__button__inactive]: !generationCodeEnd,
  });

  const handleButtonOnClick = () => {
    if (generationCodeEnd){

      console.log("first")
    }
  }

  return (
    <div className={style.block__creationRoom}>
      <div className={style.creationRoom__title}>Присоединиться к комнате!</div>
      <RoomIdInput sendGenerationEnd={handleGenerationEnd} />
      <div onClick={handleButtonOnClick} className={classNames(style.creationRoom__button, topControlsPlayClassList)}>Слушать музыку Vmeste</div>
    </div>
  )
}
