import './App.css';
import { Outlet } from 'react-router-dom';
import SocketProvider from './Socket/SocketProvider';
import Chart from './Chart';
import { io } from 'socket.io-client';
import { useEffect } from 'react';


// const socket = io('<wss://localhost:8080>');



function App() {
  return (
    <div className="App">
      {/* <SocketProvider> */}
        <Outlet />
        {/* <Chart /> */}
      {/* </SocketProvider> */}
    </div>
  );
}

export default App;
