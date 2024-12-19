const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = 0;

io.on("connection", (socket) => {
    console.log('A player connected');
    players++;
    io.emit("player-count", players);
    if (players === 1) {
        socket.emit('waiting', 'Waiting for a second player...');
    } else if (players === 2) {
        io.emit('startGame', 'Game is starting!');
    }

    socket.on("match-found", (data) => {
        io.emit("update-board", data);
    });

    socket.on("disconnect", () => {
        console.log('A player disconnected');
        players--;
        io.emit("player-count", players);
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

   

   