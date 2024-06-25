// socket.js
import io from 'socket.io-client';

const socket = io('http://192.168.1.75:8000', {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"  
    }
});
export default socket;
