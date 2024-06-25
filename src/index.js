import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import './index.css';
import App from './App';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import CreationRoomPage from './pages/CreationRoomPage/CreationRoomPage';
import { Provider } from 'react-redux';
import store from './store/store';
import SocketProvider from './Socket/SocketProvider';
import ConectionRoomPage from './pages/ConnectiomRoomPage/ConnectiomRoomPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/player" replace />
      },
      {
        path: "/player",
        element: <PlayerPage />
      },
      {
        path: "/createroom",
        element: <CreationRoomPage />
      },
      {
        path: "/connecttoroom",
        element: <ConectionRoomPage />
      }
    ]
  }
]);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <SocketProvider >
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </SocketProvider>
  </Provider>
  // </React.StrictMode>
);
