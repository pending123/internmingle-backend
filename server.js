require('dotenv/config')
const express = require('express')
const { clerkClient, requireAuth, getAuth } = require('@clerk/express')

const app = express()
const PORT = 3000

app.use(requireAuth())

app.get('/protected', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req)

    const user = await clerkClient.users.getUser(userId)

    return res.json({ user })
})

app.listen(PORT, () => {
    console.log(`Testing listening at: http://localhost:${PORT}`)
})