require('dotenv').config();
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

const neighborhoodRoutes = require("./src/routes/neighborhoodRoutes");

app.use("/api/neighborhoods", neighborhoodRoutes);

app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));