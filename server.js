require('dotenv/config')
const express = require('express')
const { clerkClient, requireAuth, getAuth } = require('@clerk/express')
const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");
const profileRoutes = require('./src/routes/profileRoutes');
const { webhookHandler } = require('./src/controllers/clerkWebhooks');


const app = express()
const PORT = 3000

app.use('/webhook/clerk', express.raw({ type: 'application/json' }));

app.use(express.json())

app.post ('/webhook/clerk', webhookHandler);

app.get('/protected', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req)
    res.json({userId})
})


app.use('/api/profiles', profileRoutes);
app.use("/api/neighborhoods", neighborhoodRoutes);

app.get('/', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    return res.json({ user });
})

app.listen(PORT, () => {
    console.log(`Testing listening at: http://localhost:${PORT}`)
})