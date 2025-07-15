require('dotenv/config')
const express = require('express')
const { clerkClient, requireAuth, getAuth } = require('@clerk/express')
const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");

const cors = require("cors");

const corsOption = {
  origin: "http://localhost:5173",
};

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors(corsOption));

app.get('/protected', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req)
    res.json({userId})
})

app.use("/api/neighborhoods", neighborhoodRoutes);

app.get('/', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    return res.json({ user });
})

app.listen(PORT, () => {
    console.log(`Testing listening at: http://localhost:${PORT}`)
})