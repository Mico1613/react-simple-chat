import React from "react";
import socket from "../socket";

function Chat({ users, messages, name, room, onAddMessage }) {
  const [textValue, setTextValue] = React.useState("");
  const messagesRef = React.useRef(null);
  const onSendMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", {
      name,
      room,
      text: textValue,
    });
    onAddMessage({
      name,
      text: textValue,
    });
    setTextValue("");
  };
  const onEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSendMessage();
    }
  };
  React.useEffect(() => {
    messagesRef.current.scrollTo({ top: 9999999, behavior: "smooth" });
  }, [messages]);
  console.log(messagesRef);
  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__block users">
          <div className="room-name">
            <p>Комната: {room}</p>
          </div>
          <div className="all-users">
            <div className="users-amount">Users ({users.length}):</div>
            <ul>
              {users.map((name, index) => (
                <li key={name + index}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="chat__block messages">
          <div className="messages__screen" ref={messagesRef}>
            {messages.map((message, index) => (
              <div>
                <p>{message.text}</p>
                <span>{message.name}</span>
              </div>
            ))}
          </div>
          <div className="messages__to-send">
            <textarea
              name="msg"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={onEnterPress}
            ></textarea>
            <button onClick={onSendMessage} className="btn">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
