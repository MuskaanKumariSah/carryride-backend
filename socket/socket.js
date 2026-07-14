let io;

function init(serverIo) {

    io = serverIo;

    io.on("connection", (socket) => {

        console.log("Socket Connected:", socket.id);

        socket.on("joinUserRoom", (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} joined room user_${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnected:", socket.id);
        });

    });
}

function getIO() {

    if (!io) {
        throw new Error("Socket.io not initialized yet");
    }

    return io;
}

module.exports = { init, getIO };