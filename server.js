const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.json());

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const { id: room } = req.params;
  const obj = rooms.has(room)
    ? {
        users: [...rooms.get(room).get("users").values()],
        messages: [...rooms.get(room).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});
app.post("/rooms", (req, res) => {
  const { room, name } = req.body;
  if (!rooms.has(room)) {
    rooms.set(
      room,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ room, name }) => {
    socket.join(room);
    rooms.get(room).get("users").set(socket.id, name);
    const users = [...rooms.get(room).get("users").values()];
    socket.broadcast.to(room).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ room, name, text }) => {
    const obj = {
      name,
      text,
    };
    rooms.get(room).get("messages").push(obj);
    socket.broadcast.to(room).emit("ROOM:NEW_MESSAGE", obj);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, room) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(room).emit("ROOM:SET_USERS", users);
      }
    });
  });
});

server.listen(8080, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Сервер запущен");
});
