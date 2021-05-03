import React from "react";
import "./App.scss";
import axios from "axios";
import Chat from "./components/Chat";
import LogIn from "./components/LogIn";
import reducer from "./reducer";
import socket from "./socket";

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    room: null,
    name: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });
    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(`/rooms/${obj.room}`);
    dispatch({
      type: "SET_DATA",
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };
  const addMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  return (
    <div>
      {!state.joined ? (
        <LogIn onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
