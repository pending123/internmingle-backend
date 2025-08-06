require("dotenv/config");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { clerkClient, requireAuth, getAuth } = require("@clerk/express");

const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const photoRoutes = require("./src/routes/photoRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const { webhookHandler } = require("./src/controllers/clerkWebhooks");
const placesRoutes = require('./src/routes/eventPlacesRoutes')
const traitRoutes = require('./src/routes/traitsRoutes')
const hobbiesRoutes = require('./src/routes/hobbiesRoutes')
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.internmingle.tech"
]

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookHandler
);

//app.use('/api/webhooks', express.raw({ type: 'application/json' }));


app.use(eventRoutes);

//app.post ('/api/webhooks', webhookHandler);

app.use("/api/profiles", profileRoutes);
app.use("/api/neighborhoods", neighborhoodRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/places', placesRoutes);
app.use('/api', traitRoutes);
app.use('/api', hobbiesRoutes);

app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
});

app.get("/", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId);
  res.json({ user });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinUser', (userId) => {
    socket.join(`user_${userId}`);
    socket.userId = userId;
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
