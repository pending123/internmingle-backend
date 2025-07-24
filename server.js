require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { clerkClient, requireAuth, getAuth } = require("@clerk/express");

const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const { webhookHandler } = require("./src/controllers/clerkWebhooks");

const cors = require("cors");

const eventRoutes = require("./src/routes/eventRoutes");

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true, //test
};

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://internmingle.tech"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookHandler
);

//app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cors(corsOption));
app.use(eventRoutes);

//app.post ('/api/webhooks', webhookHandler);

app.use("/api/profiles", profileRoutes);
app.use("/api/neighborhoods", neighborhoodRoutes);
app.use("/", eventRoutes);


app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
});

app.get("/", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId);
  res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Testing on ${PORT} `);
});
