require("dotenv/config");
const express = require("express");
const { clerkClient, requireAuth, getAuth } = require("@clerk/express");
const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const { webhookHandler } = require("./src/controllers/clerkWebhooks");

const cors = require("cors");

const eventRoutes = require("./src/routes/eventRoutes");
const app = express();
const PORT = 3000;
const corsOption = {
  origin: "http://localhost:5173",
};
app.use(express.json());
app.use(cors(corsOption));



//TEMP__TESTING
app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookHandler
);

//app.use('/api/webhooks', express.raw({ type: 'application/json' }));



app.use("/", eventRoutes);

//app.post ('/api/webhooks', webhookHandler);

app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
});

app.use("/api/profiles", profileRoutes);
app.use("/api/neighborhoods", neighborhoodRoutes);

app.get("/", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId);
  return res.json({ user });
});

app.listen(PORT, () => {
    console.log(`Testing on ${PORT} `)
});
