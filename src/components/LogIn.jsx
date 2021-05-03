import React from "react";
import { useState } from "react";
import axios from "axios";

function LogIn({ onLogin }) {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [isLoaded, setLoaded] = useState(true);

  const onEnter = async () => {
    if (!name || !room) {
      alert("Введите номер комнаты и ваше имя");
      return null;
    }
    const obj = {
      name,
      room,
    };
    setLoaded(false);
    await axios.post("/rooms", obj);
    onLogin(obj);
  };
  
  return (
    <div>
      <div className="wrapper">
        <div className="room-id">
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            maxLength={10}
          />
        </div>
        <div className="name">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </div>
        <button onClick={onEnter} disabled={!isLoaded}>
          {isLoaded ? <p>log in</p> : <p>Loading...</p>}
        </button>
      </div>
    </div>
  );
}

export default LogIn;
