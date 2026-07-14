const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const luggageRoutes = require("./routes/luggageRoutes");
const rideRoutes = require("./routes/rideRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const socketManager = require("./socket/socket");
socketManager.init(io);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to CarryRide Backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/luggage", luggageRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
    console.log(`CarryRide Server Running on Port ${PORT}`);
});