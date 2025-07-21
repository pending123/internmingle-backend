require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
const cors = require("cors")

const corsOption = {
    origin: "http://localhost:3000"
}

const eventRoutes = require("./src/routes/eventRoutes")


app.use(cors(corsOption))
app.use("/", eventRoutes)
app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));